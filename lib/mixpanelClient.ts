// import mixpanel from 'mixpanel-browser';
 
// const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
 
// export const initMixpanel = () => {
//   if (!MIXPANEL_TOKEN) {
//     console.warn('Mixpanel token is missing! Check your .env file.');
//     return;
//   }
 
//   mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
// }

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.');
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: true, // Opsional: untuk melihat log event di console
    track_pageview: true, // Opsional: otomatis track pageview
    persistence: "localStorage" // Opsional: simpan data pengguna di localStorage
  });

  console.log("Mixpanel initialized successfully!");
};
// Near entry of your product, init Mixpanel
mixpanel.init("YOUR_TOKEN", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});