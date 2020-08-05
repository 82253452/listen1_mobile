import queryString from 'query-string';
import {weapi} from '../../modules/crypto';
import {DOMParser} from 'react-native-html-parser';
import CryptoJS from '../../../vendor/cryptojs_aes';
import JSEncrypt from '../../../vendor/jsencrypt';
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
function showPlaylist(page) {
  const url = `http://music.migu.cn/v3/music/playlist?page=${page}`;

  return fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const domObj = new DOMParser().parseFromString(data, 'text/html');
      const playlist_elements = Array.from(
        domObj
          .getElementsByClassName('song-list-cont', false)[0]
          .getElementsByTagName('ul')[0]
          .getElementsByTagName('li'),
      );
      const result = playlist_elements.map((item) => ({
        cover_img_url: handleProtocolRelativeUrl(
          item
            .getElementsByClassName('img-full', false)[0]
            .getAttribute('data-original'),
        ),
        title: item
          .getElementsByClassName('song-list-name')[0]
          .getElementsByTagName('a')[0].textContent,
        id: `mgplaylist_${item
          .getElementsByClassName('playlist-play', false)[0]
          .getAttribute('data-id')}`,
        source_url: `http://music.migu.cn/v3/music/playlist/${item
          .getElementsByClassName('playlist-play', false)[0]
          .getAttribute('data-id')}`,
      }));
      return {result, hasNextPage: page < 120};
    })
    .catch(() => {
      // console.error(error);
    });
}
function handleProtocolRelativeUrl(url) {
  const regex = /^.*?\/\//;
  const result = url.replace(regex, 'http://');
  return result;
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
  const listId = playlistId.split('_').pop();

  const url = `http://music.migu.cn/v3/music/playlist/${listId}`;

  return fetch(url)
    .then((res) => res.text())
    .then((res) => {
      const domObj = new DOMParser().parseFromString(res, 'text/html');
      const song_elements = Array.from(
        domObj
          .getElementsByClassName('songlist-body')[0]
          .getElementsByClassName('row J_CopySong'),
      );
      const cover_url = handleProtocolRelativeUrl(
        domObj.getElementsByClassName('thumb-img')[0].getAttribute('src'),
      );
      const title = domObj
        .getElementsByClassName('thumb-img')[0]
        .getAttribute('alt');
      const info = {
        id: `playlist_${listId}`,
        cover_img_url: cover_url,
        title: title,
        source_url: url,
      };
      const tracks = song_elements.map((item) => {
        const cid = item
          .getElementsByClassName('song-index J_SongIndex song-play')[0]
          .getAttribute('data-cid');

        let album_name = '';
        const album_list = item
          .getElementsByClassName('song-belongs')[0]
          .getElementsByTagName('a');
        if (album_list.length > 0) {
          album_name = album_list[0].getAttribute('title');
        }

        const artist_url_list = item
          .getElementsByClassName('song-singers J_SongSingers')[0]
          .getElementsByTagName('a')[0]
          .getAttribute('href')
          .split('/');
        const artist_id = artist_url_list[artist_url_list.length - 1];

        return {
          id: `mgtrack_${cid}`,
          title: item
            .getElementsByClassName('song-name J_SongName')[0]
            .getElementsByTagName('a')[0].textContent,
          artist: item
            .getElementsByClassName('song-singers J_SongSingers')[0]
            .getElementsByTagName('a')[0].textContent,
          artist_id: `mgartist_${artist_id}`,
          album: album_name,
          album_id: `mgalbum_${item
            .getElementsByClassName('song-index J_SongIndex song-play')[0]
            .getAttribute('data-aid')}`,
          source: 'migu',
          source_url: `http://music.migu.cn/v3/music/song/${cid}`,
          img_url: cover_url, // TODO: use different cover for every song solution: change to mobile api. By now some play problem exists.
          url: `mgtrack_${cid}`,
          disabled: !cid,
        };
      });
      return {
        info,
        tracks,
      };
    });
}

function bootstrapTrack(trackId) {
  const song_id = trackId.slice('mgtrack_'.length);

  const k = '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';
  const rsaEncrypt = new JSEncrypt();
  const publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8asrfSaoOb4je+DSmKdriQJKW\nVJ2oDZrs3wi5W67m3LwTB9QVR+cE3XWU21Nx+YBxS0yun8wDcjgQvYt625ZCcgin\n2ro/eOkNyUOTBIbuj9CvMnhUYiR61lC1f1IGbrSYYimqBVSjpifVufxtx/I3exRe\nZosTByYp4Xwpb1+WAQIDAQAB\n-----END PUBLIC KEY-----';
  rsaEncrypt.setPublicKey(publicKey);
  const secKey = rsaEncrypt.encrypt(k);
  // type parameter for music quality: 1: normal 2: hq 3: sq
  const aesResult = CryptoJS.AES.encrypt(
    `{"copyrightId":"${song_id}","type":2,"auditionsFlag":0}`,
    k,
  ).toString();

  const url = `http://music.migu.cn/v3/api/music/audioPlayer/getPlayInfo?dataType=2&data=${encodeURIComponent(
    aesResult,
  )}&secKey=${encodeURIComponent(secKey)}`;
  return fetch(url, {
    headers: {
      referer: 'http://music.migu.cn',
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => res.json())
    .then(({data}) => {
      let playUrl = '';
      if (data.playUrl) {
        if (data.playUrl.startsWith('//')) {
          playUrl = 'https:' + data.playUrl;
        }
      }
      return playUrl;
    });
}

function search(keyword, curpage) {
  const target_url = `http://m.music.migu.cn/migu/remoting/scr_search_tag?rows=20&type=2&keyword=${keyword}&pgc=${curpage}`;
  return fetch(target_url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const tracks = data.musics.map((song_info) => ({
        id: `mgtrack_${song_info.copyrightId}`,
        title: song_info.songName,
        artist: song_info.singerName.split(',')[0],
        artist_id: `mgartist_${song_info.singerId.split(',')[0]}`,
        album: song_info.albumName,
        album_id: `mgalbum_${song_info.albumId}`,
        source: 'migu',
        source_url: `http://music.migu.cn/v3/music/song/${song_info.copyrightId}`,
        img_url: song_info.cover,
        url: `mgtrack_${song_info.copyrightId}`,
        disabled: false,
      }));
      return {
        result: tracks,
        total: data.pgt * 20,
      };
    });
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

const meta = {name: '咪咕', platformId: 'mg', enName: 'migu'};

export default {
  meta,
  showPlaylist,
  getPlaylist,
  bootstrapTrack,
  search,
  parseUrl,
};
