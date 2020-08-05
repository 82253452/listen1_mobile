/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
import queryString from 'query-string';
import {weapi} from '../../modules/crypto';

function requestAPI(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      referer: 'http://m.kugou.com',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
    body: queryString.stringify(weapi(data)),
  })
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      // console.error(error);
    });
}
function getSmallImageUrl(url) {
  return `${url}?param=140y140`;
}
async function showPlaylist(page = 1) {
  if (page > 1) {
    return;
  }
  const url = `https://www.bilibili.com/audio/music-service-c/web/menu/hit?ps=20&pn=${page}`;

  return await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(({data}) => {
      const result = data.data.map((item) => ({
        cover_img_url: item.cover,
        title: item.title,
        id: `biplaylist_${item.menuId}`,
        source_url: `https://www.bilibili.com/audio/am${item.menuId}`,
      }));
      return {result};
    })
    .catch((err) => {
      console.error(err);
    });
}
function getNEScore(song) {
  if (!song) {
    return 0;
  }
  const privilege = song.privilege;

  if (song.program) {
    return 0;
  }

  if (privilege) {
    if (privilege.st != null && privilege.st < 0) {
      return 100;
    }
    if (
      privilege.fee > 0 &&
      privilege.fee !== 8 &&
      privilege.payed === 0 &&
      privilege.pl <= 0
    ) {
      return 10;
    }
    if (
      privilege.fee === 16 ||
      (privilege.fee === 4 && privilege.flag & 2048)
    ) {
      return 11;
    }
    if (
      (privilege.fee === 0 || privilege.payed) &&
      privilege.pl > 0 &&
      privilege.dl === 0
    ) {
      return 1e3;
    }
    if (privilege.pl === 0 && privilege.dl === 0) {
      return 100;
    }

    return 0;
  }

  if (song.status >= 0) {
    return 0;
  }
  if (song.fee > 0) {
    return 10;
  }

  return 100;
}

function isPlayable(song) {
  return getNEScore(song) < 100;
}

function convert(allowAll) {
  return (songInfo) => ({
    id: `netrack_${songInfo.id}`,
    title: songInfo.name,
    artist: songInfo.ar[0].name,
    artist_id: `neartist_${songInfo.ar[0].id}`,
    album: songInfo.al.name,
    album_id: `nealbum_${songInfo.al.id}`,
    source: 'netease',
    source_url: `http://music.163.com/#/song?id=${songInfo.id}`,
    img_url: getSmallImageUrl(songInfo.al.picUrl),
    url: `netrack_${songInfo.id}`,
    disabled: allowAll ? false : !isPlayable(songInfo),
  });
}

function getPlaylist(playlistId) {
  const list_id = playlistId.split('_')[0];
  const d = playlistId.split('_').pop();
  switch (list_id) {
    case 'biplaylist':
      return bi_get_playlist(d);
    // case 'bialbum':
    //   return bi_album(url, hm, se);
    // case 'biartist':
    //   return bi_artist(url, hm, se);
    default:
      return null;
  }
}

async function bi_get_playlist(list_id) {
  const target_url = `https://www.bilibili.com/audio/music-service-c/web/menu/info?sid=${list_id}`;
  const info = await fetch(target_url)
    .then((response) => {
      return response.json();
    })
    .then(({data}) => ({
      cover_img_url: data.cover,
      title: data.title,
      id: `biplaylist_${list_id}`,
      source_url: `https://www.bilibili.com/audio/am${list_id}`,
    }));
  const target = `https://www.bilibili.com/audio/music-service-c/web/song/of-menu?pn=1&ps=100&sid=${list_id}`;

  const tracks = await fetch(target)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      return res.data.data.map((song_info) => ({
        id: `bitrack_${song_info.id}`,
        title: song_info.title,
        artist: song_info.uname,
        artist_id: `biartist_${song_info.uid}`,
        source: 'bilibili',
        source_url: `https://www.bilibili.com/audio/au${song_info.id}`,
        img_url: song_info.cover,
        url: song_info.id,
        lyric_url: song_info.lyric,
      }));
    });
  return {
    info,
    tracks,
  };
}

function bootstrapTrack(trackId) {
  const song_id = trackId.slice('bitrack_'.length);
  const target_url = `https://www.bilibili.com/audio/music-service-c/web/url?sid=${song_id}`;

  return fetch(target_url, {
    headers: {
      referer: 'http://m.kugou.com',
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => res.json())
    .then(({data}) => {
      return data.cdns && data.cdns[0];
    });
}

async function search(keyword, curpage) {
  const au = /\d+$/.exec(keyword);
  if (!au) {
    return {
      result: [],
      total: 0,
    };
  }
  let target_url = `https://www.bilibili.com/audio/music-service-c/web/song/info?sid=${au}`;
  return fetch(target_url)
    .then((response) => {
      return response.json();
    })
    .then(({data}) => {
      const tracks = [bi_convert_song(data)];
      return {
        result: tracks,
        total: 1,
      };
    });

  // inferred, not implemented yet
  // target_url = `https://api.bilibili.com/x/web-interface/search/type?search_type=audio&keyword=${keyword}&page=${curpage}`;
  // fetch(target_url).then((response) => {
  //   const {data} = response.data;
  //   const tracks = data.result.map((item) => bi_convert_song(item));
  //   return {
  //     result: tracks,
  //     total: data.numResults,
  //   };
  // });
  // return null;
}

function bi_convert_song(song_info) {
  const track = {
    id: `bitrack_${song_info.id}`,
    title: song_info.title,
    artist: song_info.uname,
    artist_id: `biartist_${song_info.uid}`,
    source: 'bilibili',
    source_url: `https://www.bilibili.com/audio/au${song_info.id}`,
    img_url: song_info.cover,
    url: song_info.id,
    lyric_url: song_info.lyric,
  };
  return track;
}

function parseUrl(url) {
  let result = null;

  const r = /\/\/music\.163\.com\/playlist\/([0-9]+)/g.exec(url);

  if (r !== null) {
    return {
      type: 'playlist',
      id: `neplaylist_${r[1]}`,
    };
  }

  if (
    url.search('//music.163.com/#/m/playlist') !== -1 ||
    url.search('//music.163.com/#/playlist') !== -1 ||
    url.search('//music.163.com/playlist') !== -1 ||
    url.search('//music.163.com/#/my/m/music/playlist') !== -1
  ) {
    const parsed = queryString.parseUrl(url);

    result = {
      type: 'playlist',
      id: `neplaylist_${parsed.query.id}`,
    };
  }

  return result;
}

const meta = {name: 'bilibili', platformId: 'bi', enName: 'bilibili'};

export default {
  meta,
  showPlaylist,
  getPlaylist,
  bootstrapTrack,
  search,
  parseUrl,
};
