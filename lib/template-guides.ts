import type { TemplateDefinition } from '@/lib/templates';

export type GuideSection = { title: string; body: string };
export type TemplateGuide = {
  bn: { intro: string; sections: GuideSection[] };
  en: { intro: string; sections: GuideSection[] };
};

const commonBn = (name: string): GuideSection[] => [
  { title: '1. Template ব্যবহার শুরু করুন', body: `Template Library থেকে “${name}” নির্বাচন করে “Use template” চাপুন। লগইন না থাকলে আগে account তৈরি হবে, তারপর editor খুলবে। একই template আগে draft হিসেবে বানানো থাকলে নতুন draft না খুলে সেই draft-টাই আবার খুলবে।` },
  { title: '2. Edit mode-এ শুরু করুন', body: 'Editor-এ canvas সবসময় edit mode-এ থাকবে। যেসব লেখা, ছবি, ভিডিও বা button editable সেগুলো highlight থাকবে। যেটা বদলাতে চান সেটার ওপর click করলে তার editing box খুলবে।' },
  { title: '3. Live update দেখুন', body: 'কোনো field বদলানোর সাথে সাথে canvas-এ পরিবর্তন দেখা যাবে। আলাদা করে Done চাপা বাধ্যতামূলক নয়; editor auto-save করে। Preview চাপলে visitor যেভাবে website দেখবে সেভাবেই পুরো experience দেখা যাবে।' },
  { title: '4. ভুল হলে Undo / Redo / Reset', body: 'ভুল edit হলে Undo দিয়ে আগের অবস্থায় ফিরুন, Redo দিয়ে আবার আনুন। পুরো template-এর default content ফিরিয়ে আনতে Reset ব্যবহার করুন।' },
  { title: '5. Publish করে live link নিন', body: 'সবকিছু ঠিক হলে Create Live Link/Publish ব্যবহার করুন। তখন আপনার account-এর website record-এর জন্য একটি live link তৈরি হবে। পরে edit করলে একই website-এর data update হবে—অন্য user বা অন্য template-এর data বদলাবে না।' },
];

export const templateGuides: Record<string, TemplateGuide> = {
  master: {
    bn: {
      intro: 'Master Template দিয়ে একটি সম্পূর্ণ cinematic birthday website বানাতে নিচের flow অনুসরণ করুন। Template-এর default design, animation এবং interaction আগে থেকেই তৈরি আছে; আপনাকে মূলত নিজের content বসাতে হবে।',
      sections: [
        { title: '1. Master Template নির্বাচন করুন', body: 'Birthday category-তে Master Template-এর “Use template” চাপুন। আগে একই template দিয়ে draft তৈরি থাকলে সেটিই reopen হবে, তাই বারবার নতুন website তৈরি হবে না।' },
        { title: '2. Countdown সেট করুন', body: 'Countdown screen-এর সংখ্যা/সময় অংশে click করে Birthday date, exact time এবং age সেট করুন। Countdown title এবং “Something is coming soon...” message-ও edit করা যায়। Date/time বদলালে countdown live update হবে।' },
        { title: '3. Greeting screen সাজান', body: '“Hey You Know What! …” greeting line, greeting message এবং “Click to enter your world” button text নিজের মতো লিখুন। যেকোনো editable text-এ click করলেই তার editor খুলবে।' },
        { title: '4. Cake screen customize করুন', body: 'Cake-এর ওপরের happy, birthday এবং recipient name-এর যেকোনো text-এ click করলে একটি একক Cake Text editor খুলবে। তিনটিই একসাথে edit করুন। Cake cut শেষ হলে যে status/message এবং next button দেখা যায় সেগুলোও editable।' },
        { title: '5. Reasons যোগ ও edit করুন', body: 'Reason 1 থেকে শুরু করুন। প্রতিটি reason আলাদা করে edit করুন। “Click Here” চাপলে Reason 2, তারপর 3, তারপর 4 দেখা যাবে। Previous চাপলে 3→2→1 এ ফিরে যাবে। অন্য page-এ গিয়ে আবার Reasons-এ ফিরলেও আপনার edits থাকবে।' },
        { title: '6. Photo section তৈরি করুন', body: 'Photo section-এ default 4টি photo রাখা থাকে। যেকোনো card, photo, title বা caption-এ click করে image upload/URL, title, caption এবং supporting text বদলান। চাইলে নতুন memory যোগ করুন।' },
        { title: '7. Video section তৈরি করুন', body: 'Video section-এ default 2টি video রাখা থাকে। Video card, title বা caption-এ click করে source বদলান। Local upload 25 MB-এর মধ্যে রাখুন; বড় file হলে public video link ব্যবহার করুন।' },
        { title: '8. Letter ও envelope customize করুন', body: '“Tap the envelope to open it” ব্যবহার করে letter খুলুন। Letter-এর সব paragraph একই editor flow-এ পাওয়া যাবে; যেকোনো paragraph click করে text বদলান।' },
        { title: '9. Secret section তৈরি করুন', body: 'Secret photo-তে upload অথবা public image URL ব্যবহার করুন। “See Your Friend” button-এর text এবং profile link আলাদাভাবে edit করুন। Instagram, Facebook বা যেকোনো public profile URL দেওয়া যাবে।' },
        { title: '10. Audio সেট করুন', body: 'Countdown screen-এ countdown audio এবং Greeting screen-এ wishing/background audio আলাদা করে সেট করুন। Custom audio না দিলে template-এর default audio ব্যবহার হবে। Demo-তে Audio ON/OFF আলাদা থাকে; editor preview silent থাকে।' },
        { title: '11. Preview-তে পুরো website পরীক্ষা করুন', body: 'Preview চাপলে countdown থেকে শুরু করে Greeting → Cake → Reasons → Photos → Videos → Letter → Secret পর্যন্ত visitor view দেখুন। Desktop, tablet ও mobile preview-ও দেখে নিন।' },
        { title: '12. Save ও Live Link তৈরি করুন', body: 'Content auto-save হলেও শেষবার Preview করে নিশ্চিত হন সবকিছু ঠিক আছে। তারপর Create Live Link/Publish চাপুন। এই website আপনার account-এর নিজস্ব data হিসেবে সংরক্ষিত থাকবে এবং live link থেকে ঠিক সেই edited version দেখা যাবে।' },
      ]
    },
    en: {
      intro: 'Use the Master Template to build a complete cinematic birthday website. The design, animations and interactions are already prepared; you mainly replace the content with your own.',
      sections: [
        { title: '1. Choose Master Template', body: 'Open the Birthday category and click “Use template” on Master Template. If you already have a draft for the same template, that draft reopens instead of creating another one.' },
        { title: '2. Set the countdown', body: 'Click the countdown area to set the birthday date, exact time and age. You can also edit the countdown title and the “Something is coming soon...” message. Changes update live.' },
        { title: '3. Customize the greeting', body: 'Edit the “Hey You Know What! …” greeting line, greeting message and “Click to enter your world” button text. Click any highlighted editable text to open its editor.' },
        { title: '4. Customize the cake screen', body: 'Click any of the happy, birthday or recipient-name text on the cake to open one combined Cake Text editor. You can also edit the post-cut message and next button.' },
        { title: '5. Edit all reasons', body: 'Start from Reason 1 and edit each reason independently. Click “Click Here” to move to Reason 2, then 3 and 4. Previous moves back one reason at a time. Your edits stay saved when you return later.' },
        { title: '6. Build the photo section', body: 'Four default photos are included. Click a photo card, image, title or caption to change the image, title, caption and related text. You can also add another memory.' },
        { title: '7. Build the video section', body: 'Two default videos are included. Click the video card, title or caption to replace the source. Keep uploaded videos at or below 25 MB; use a public video link for larger files.' },
        { title: '8. Customize the letter', body: 'Use “Tap the envelope to open it” to open the letter in edit mode. All letter paragraphs are available through the same editing flow; click any paragraph to change it.' },
        { title: '9. Customize the secret section', body: 'Use an upload or public image URL for the secret photo. Edit the “See Your Friend” button text and profile URL separately. Instagram, Facebook or any public profile URL can be used.' },
        { title: '10. Set audio', body: 'Countdown audio is edited on the countdown screen, while wishing/background audio is edited on the greeting screen. If you do not provide custom audio, the template default remains active.' },
        { title: '11. Test in Preview', body: 'Use Preview to experience the visitor flow from Countdown → Greeting → Cake → Reasons → Photos → Videos → Letter → Secret. Check desktop, tablet and mobile views too.' },
        { title: '12. Save and publish', body: 'Changes auto-save, but review the Preview once more. Then use Create Live Link/Publish. The website remains isolated to your account and the live link shows that exact edited version.' },
      ]
    }
  },
  'wedding-proposal': {
    bn: { intro: 'Wedding Proposal template-এর design নিজের মতো করতে template-এর content replace করুন। Interactive elements canvas থেকেই edit করুন এবং Preview-তে পুরো flow দেখে Publish করুন।', sections: commonBn('Wedding Proposal') },
    en: { intro: 'Customize the Wedding Proposal template by replacing its content. Edit interactive elements directly from the canvas, review the full flow in Preview and publish it when ready.', sections: commonBn('Wedding Proposal') },
  },
  'miss-you-1': {
    bn: { intro: 'Miss You 1 template-এর message, names, paragraphs, media এবং music নিজের মতো করে সাজান। Canvas-এর editable item-এ click করে content বদলান এবং Preview-তে final experience দেখুন।', sections: commonBn('Miss You 1') },
    en: { intro: 'Customize Miss You 1 by editing its names, messages, paragraphs, media and music. Click editable items on the canvas, then use Preview to check the final experience.', sections: commonBn('Miss You 1') },
  },
};

export function getTemplateGuide(template: TemplateDefinition): TemplateGuide {
  return templateGuides[template.slug] || {
    bn: { intro: `“${template.name}” template-এ canvas থেকে editable content বদলে Preview ও Publish ব্যবহার করুন।`, sections: commonBn(template.name) },
    en: { intro: `Customize “${template.name}” from the canvas, then use Preview and Publish to finish the website.`, sections: commonBn(template.name) },
  };
}
