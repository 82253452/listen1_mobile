function htmlDecode(s) {
  return s;
}

function qqGetImageUrl(qqimgid, imgType) {
  if (qqimgid == null) {
    return '';
  }
  let category = '';

  if (imgType === 'artist') {
    category = 'mid_singer_300';
  }
  if (imgType === 'album') {
    category = 'mid_album_300';
  }

  const s = [
    category,
    qqimgid[qqimgid.length - 2],
    qqimgid[qqimgid.length - 1],
    qqimgid,
  ].join('/');
  const url = `http://imgcache.qq.com/music/photo/${s}.jpg`;

  return url;
}

function qqIsPlayable(song) {
  const switchFlag = song.switch.toString(2).split('');

  switchFlag.pop();
  switchFlag.reverse();
  // flag switch table meaning:
  // ["play_lq", "play_hq", "play_sq", "down_lq", "down_hq", "down_sq", "soso",
  //  "fav", "share", "bgm", "ring", "sing", "radio", "try", "give"]
  const playFlag = switchFlag[0];

  return playFlag === '1';
}

function qqConvertSong(song) {
  const d = {
    id: `qqtrack_${song.songmid}`,
    title: htmlDecode(song.songname),
    artist: htmlDecode(song.singer[0].name),
    artist_id: `qqartist_${song.singer[0].mid}`,
    album: htmlDecode(song.albumname),
    album_id: `qqalbum_${song.albummid}`,
    img_url: qqGetImageUrl(song.albummid, 'album'),
    source: 'qq',
    source_url: `http://y.qq.com/#type=song&mid=${song.songmid}&tpl=yqq_song_detail`,
    url: `qqtrack_${song.songmid}`,
    disabled: !qqIsPlayable(song),
  };

  return d;
}

function showPlaylist(page) {
  const url = `https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?picmid=1&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&categoryId=10000000&sortId=5&sin=${
    (page - 1) * 30
  }&ein=${page * 30 - 1}`;

  return fetch(url, {
    headers: {
      Referer: 'https://y.qq.com/',
    },
  })
    .then((response) => response.json())
    .then((r) => {
      const playlists = r.data.list.map((item) => ({
        cover_img_url: item.imgurl,
        title: item.dissname,
        id: `qqplaylist_${item.dissid}`,
        source_url: `http://y.qq.com/#type=taoge&id=${item.dissid}`,
      }));

      return {result: playlists, hasNextPage: page * 30 - 1 < r.data.sum};
    })
    .catch(() => {
      // console.error(error);
    });
}

function search(keyword, curpage) {
  const target_url =
    `${
      'http://i.y.qq.com/s.music/fcgi-bin/search_for_qq_cp?' +
      'g_tk=938407465&uin=0&format=jsonp&inCharset=utf-8' +
      '&outCharset=utf-8&notice=0&platform=h5&needNewCode=1' +
      '&w='
    }${keyword}&zhidaqu=1&catZhida=1` +
    `&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=${curpage}&remoteplace=txt.mqq.all&_=1459991037831&jsonpCallback=jsonp4`;
  return fetch(target_url, {
    headers: {
      referer: 'http://i.y.qq.com',
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      data = data.slice('jsonp4('.length, -')'.length);
      data = JSON.parse(data);
      const tracks = data.data.song.list.map((item) => qq_convert_song(item));
      return {
        result: tracks,
        total: data.data.song.totalnum,
      };
    });
}

function qq_convert_song(song) {
  const d = {
    id: `qqtrack_${song.songmid}`,
    title: htmlDecode(song.songname),
    artist: htmlDecode(song.singer[0].name),
    artist_id: `qqartist_${song.singer[0].mid}`,
    album: htmlDecode(song.albumname),
    album_id: `qqalbum_${song.albummid}`,
    img_url: qq_get_image_url(song.albummid, 'album'),
    source: 'qq',
    source_url: `http://y.qq.com/#type=song&mid=${song.songmid}&tpl=yqq_song_detail`,
    url: `qqtrack_${song.songmid}`,
    disabled: !qq_is_playable(song),
  };
  return d;
}

function getPlaylist(playlistId) {
  const list_id = playlistId.split('_')[0];
  const d = playlistId.split('_').pop();
  switch (list_id) {
    case 'qqplaylist':
      return qq_get_playlist(d);
    // case 'qqalbum':
    //   return qq_album(d);
    // case 'qqartist':
    //   return qq_artist(d);
    default:
      return null;
  }
}

async function qq_get_playlist(playlistId) {
  const target_url = `http://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&jsonpCallback=jsonCallback&nosign=1&disstid=${playlistId}&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=GB2312&outCharset=utf-8&notice=0&platform=yqq&jsonpCallback=jsonCallback&needNewCode=0`;
  return await fetch(target_url, {
    headers: {
      Referer: 'https://y.qq.com/',
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      data = data.slice('jsonCallback('.length, -')'.length);
      data = JSON.parse(data);
      const info = {
        cover_img_url: data.cdlist[0].logo,
        title: data.cdlist[0].dissname,
        id: `qqplaylist_${playlistId}`,
        source_url: `http://y.qq.com/#type=taoge&id=${playlistId}`,
      };
      const tracks = data.cdlist[0].songlist.map((song) => ({
        id: `qqtrack_${song.songmid}`,
        title: htmlDecode(song.songname),
        artist: htmlDecode(song.singer[0].name),
        artist_id: `qqartist_${song.singer[0].mid}`,
        album: htmlDecode(song.albumname),
        album_id: `qqalbum_${song.albummid}`,
        img_url: qq_get_image_url(song.albummid, 'album'),
        source: 'qq',
        source_url: `http://y.qq.com/#type=song&mid=${song.songmid}&tpl=yqq_song_detail`,
        url: `qqtrack_${song.songmid}`,
        disabled: !qq_is_playable(song),
      }));
      return {info, tracks};
    });
}

function qq_get_image_url(qqimgid, img_type) {
  if (qqimgid == null) {
    return '';
  }
  let category = '';
  if (img_type === 'artist') {
    category = 'T001R300x300M000';
  }
  if (img_type === 'album') {
    category = 'T002R300x300M000';
  }

  const s = category + qqimgid;
  const url = `https://y.gtimg.cn/music/photo_new/${s}.jpg`;
  return url;
}

function qq_is_playable(song) {
  const switch_flag = song.switch.toString(2).split('');
  switch_flag.pop();
  switch_flag.reverse();
  // flag switch table meaning:
  // ["play_lq", "play_hq", "play_sq", "down_lq", "down_hq", "down_sq", "soso",
  //  "fav", "share", "bgm", "ring", "sing", "radio", "try", "give"]
  const play_flag = switch_flag[0];
  const try_flag = switch_flag[13];
  return play_flag === '1' || (play_flag === '1' && try_flag === '1');
}

function bootstrapTrack(trackId) {
  const songId = trackId.slice('qqtrack_'.length);
  const targetUrl =
    `${
      'https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&' +
      'hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&' +
      'platform=yqq.json&needNewCode=0&data=%7B%22req_0%22%3A%7B%22' +
      'module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22' +
      'CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%2210000%22%2C%22songmid%22%3A%5B%22'
    }${songId}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%220%22%2C%22loginflag%22` +
    '%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A0%2C%22' +
    'format%22%3A%22json%22%2C%22ct%22%3A20%2C%22cv%22%3A0%7D%7D';

  return fetch(targetUrl, {
    method: 'GET',
    headers: {
      Referer: 'https://y.qq.com/',
      'User-Agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.req_0.data.midurlinfo[0].purl === '') {
        return '';
      }
      const url = data.req_0.data.sip[0] + data.req_0.data.midurlinfo[0].purl;

      // console.log(url);

      return url;
    });
}

function parseUrl(url) {
  let result = null;
  let match = /\/\/y.qq.com\/n\/yqq\/playlist\/([0-9]+)/.exec(url);

  if (match != null) {
    const playlistId = match[1];

    result = {
      type: 'playlist',
      id: `qqplaylist_${playlistId}`,
    };
  }
  match = /\/\/y.qq.com\/n\/yqq\/playsquare\/([0-9]+)/.exec(url);
  if (match != null) {
    const playlistId = match[1];

    result = {
      type: 'playlist',
      id: `qqplaylist_${playlistId}`,
    };
  }
  match = /\/\/y.qq.com\/n\/m\/detail\/taoge\/index.html\?id=([0-9]+)/.exec(
    url,
  );
  if (match != null) {
    const playlistId = match[1];

    result = {
      type: 'playlist',
      id: `qqplaylist_${playlistId}`,
    };
  }

  return result;
}
const meta = {name: 'QQ', platformId: 'qq', enName: 'qq'};

export default {
  meta,
  showPlaylist,
  getPlaylist,
  parseUrl,
  bootstrapTrack,
  search,
  // lyric: qq_lyric,
};
