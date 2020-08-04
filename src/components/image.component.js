import React from 'react';
import {Image} from 'react-native';

function parseImageUrl(url) {
  if (!url) {
    return '';
  }
  if (url.startsWith('http')) {
    return {uri: url};
  }
  const d = {
    './assets/images/logo.png': require('../assets/images/logo.png'),
  };

  return d[url];
}
export function AImage({source, ...props}) {
  return <Image source={parseImageUrl(source)} {...props} />;
}
