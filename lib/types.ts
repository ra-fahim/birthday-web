export type GalleryItem={url:string;caption?:string};
export type Recipient={id:string;name:string;email?:string;relationship?:string;message?:string;avatarUrl?:string;language?:string};
export type GroupMember={name:string;role?:string;message:string;avatarUrl?:string};
export type Badge={id:string;label:string;icon:string;description?:string};
export type BirthdayContent={
 occasion:string; templateId?:string;
 name:string; birthday:string; greeting:string; message:string; relationship:string;
 heroTitle:string; heroSubtitle:string; reasons:string[]; gallery:GalleryItem[]; videoUrl:string; videoCaption?:string;
 letter:string[]; secret:string; musicUrl:string; theme:string; font:string; primaryColor:string;
 buttonText:string; countdownTitle:string; countdownMessage:string; countdownDaysLabel:string; countdownHoursLabel:string; countdownMinutesLabel:string; countdownSecondsLabel:string; countdownStyle:string; countdownAudioUrl:string; wishingAudioUrl:string; cakeNextButton:string; proposalEyebrow:string; proposalIntroText:string; proposalStartButton:string; proposalLetterText:string; proposalContinueButton:string; proposalQuestion:string; proposalYesButton:string; proposalNoButton:string; reasonsButton:string; photoTitle:string; photoSubtitle:string; photoNextButton:string; videoTitle:string; videoNextButton:string; letterTitle:string; letterButton:string; secretTitle:string; secretButton:string; countdown:boolean; confetti:boolean; fireworks:boolean; hearts:boolean; balloons:boolean;
 timeline:{date:string;title:string;description:string}[]; memories:string[]; wishlist:string[]; guestbook:boolean;
 social:{facebook?:string;instagram?:string;tiktok?:string;youtube?:string}; seoTitle:string; seoDescription:string;
 shareImage?:string; favicon?:string; passwordProtection:boolean; customCss:string;
 profile?:{displayName?:string;avatarUrl?:string;bio?:string};
 recipients:Recipient[];
 referralEnabled:boolean; referralCode?:string;
 madeWithBadge:boolean; whatsappShare:boolean; messengerShare:boolean;
 gamificationEnabled:boolean; badges:Badge[];
 groupBirthdayEnabled:boolean; groupMembers:GroupMember[];
 templateSpotlight?:boolean;
 timeCapsuleEnabled:boolean; timeCapsuleUnlockAt?:string; timeCapsuleMessage?:string;
 collaborativeWishesEnabled:boolean; liveReactionsEnabled:boolean;
 pdfDownloadEnabled:boolean;
 language:string; translations:Record<string,Partial<Pick<BirthdayContent,'greeting'|'message'|'heroTitle'|'heroSubtitle'|'buttonText'>>>;
 googlePhotosEnabled:boolean;
 templateConfig?:Record<string,unknown>;
};
export const defaultContent:BirthdayContent={
 occasion:'birthday', templateId:'master',
 name:'Riya',birthday:'2026-12-25',greeting:'Happy Birthday',message:'You make every ordinary moment feel special.',relationship:'Best Friend',
 heroTitle:'A special day for someone special',heroSubtitle:'Made with love by Birthday Builder.',reasons:['Your smile','Your kindness','Your beautiful heart'],gallery:[],videoUrl:'',videoCaption:'',
 letter:['Dear Riya,','Thank you for being part of my life.','May your year be full of beautiful memories.'],countdownAudioUrl:'https://res.cloudinary.com/dpctt0wao/video/upload/v1773211012/WhatsApp_Audio_2026-03-11_at_12.33.50_PM_jhzjmt.mp3',wishingAudioUrl:'https://res.cloudinary.com/dpctt0wao/video/upload/v178s6820547/ub7xhj7db3ngyig8nntr.mp3',secret:'You found the secret! 🎁',musicUrl:'',
 theme:'romantic',font:'sans',primaryColor:'#ec4899',buttonText:'Click to enter your world 💕',countdownTitle:'Something special is unlocking...⌛',countdownMessage:'⏰ Something is coming soon...',countdownDaysLabel:'Days',countdownHoursLabel:'Hours',countdownMinutesLabel:'Mins',countdownSecondsLabel:'Secs',countdownStyle:'glass',cakeNextButton:'Enter your story 💫',proposalEyebrow:'A little something · made with love',proposalIntroText:'I\'ve been holding onto a question for a while now.\nBut before I ask it… walk with me a little. 💫',proposalStartButton:'Begin ✦',proposalLetterText:'From the moment you walked into my life, everything changed. The colors got brighter, the laughs got louder, and the quiet moments became my favorite parts of the day. You\'ve shown me a kind of love I only ever thought existed in movies. You are my best friend, my confidant, and the most beautiful soul I have ever known. Every day with you is a gift — and I never want to stop unwrapping it.',proposalContinueButton:'Continue ❤️',proposalQuestion:'You are my greatest adventure, my safest home, and my one true love. Will you make me the happiest person in the universe and marry me, {name}?',proposalYesButton:'Yes, I will 💍',proposalNoButton:'No',reasonsButton:'Show me another reason 💕',photoTitle:'The Beautiful Moments',photoSubtitle:"Every moment spent with you has been magical. Let's cherish these precious memories.",photoNextButton:'Continue the story 🎥',videoTitle:'A Special Video Message',videoNextButton:'See your letter 💌',letterTitle:'A Letter for You 💌',letterButton:'Keep going ✨',secretTitle:'A little secret for you ✨',secretButton:'See Your Friend',countdown:true,confetti:true,fireworks:true,hearts:true,balloons:true,
 timeline:[],memories:[],wishlist:[],guestbook:true,social:{},seoTitle:'Happy Birthday',seoDescription:'A special birthday website.',
 shareImage:'',favicon:'',passwordProtection:false,customCss:'',
 profile:{displayName:'',avatarUrl:'',bio:''},recipients:[],referralEnabled:true,referralCode:'',madeWithBadge:true,whatsappShare:true,messengerShare:true,
 gamificationEnabled:true,badges:[],groupBirthdayEnabled:false,groupMembers:[],templateSpotlight:false,timeCapsuleEnabled:false,timeCapsuleUnlockAt:'',
 timeCapsuleMessage:'A message from the past 💌',collaborativeWishesEnabled:true,liveReactionsEnabled:true,pdfDownloadEnabled:true,
 language:'en',translations:{},googlePhotosEnabled:false
};
