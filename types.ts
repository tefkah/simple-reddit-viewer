export interface PostListing {
  kind: string;
  data: PostListingData;
}

export interface PostListingData {
  after: null;
  dist: number;
  modhash: string;
  geo_filter: string;
  children: PostChild[];
  before: null;
}

export interface PostChild {
  kind: string;
  data: PostData;
}

export interface PostData {
  approved_at_utc: null;
  subreddit: string;
  selftext: string;
  user_reports: any[];
  saved: boolean;
  mod_reason_title: null;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: Linkflairrichtext[] | null;
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string | null;
  downs: number;
  thumbnail_height: number;
  top_awarded_type: null;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  upvote_ratio: number;
  author_flair_background_color: null;
  ups: number;
  total_awards_received: number;
  media_embed: Mediaembed;
  thumbnail_width: number;
  author_flair_template_id: null;
  is_original_content: boolean;
  author_fullname: string;
  secure_media: null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: null;
  secure_media_embed: Mediaembed;
  link_flair_text: string | null;
  can_mod_post: boolean;
  score: number;
  approved_by: null;
  is_created_from_ads_ui: boolean;
  author_premium: boolean;
  thumbnail: string | null;
  edited: boolean;
  author_flair_css_class: null;
  author_flair_richtext: any[];
  gildings: Mediaembed;
  post_hint: string;
  content_categories: null;
  is_self: boolean;
  subreddit_type: string;
  created: number;
  link_flair_type: string;
  wls: number;
  removed_by_category: null;
  banned_by: null;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html: string | null;
  likes: null;
  suggested_sort: null;
  banned_at_utc: null;
  url_overridden_by_dest: string;
  view_count: null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  all_awardings: any[];
  awarders: any[];
  media_only: boolean;
  link_flair_template_id: string;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: null;
  treatment_tags: any[];
  visited: boolean;
  removed_by: null;
  mod_note: null;
  distinguished: null;
  subreddit_id: string;
  author_is_blocked: boolean;
  mod_reason_by: null;
  num_reports: null;
  removal_reason: null;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  num_duplicates: number;
  report_reasons: null;
  author: string;
  discussion_type: null;
  num_comments: number;
  send_replies: boolean;
  media: null | Media;
  contest_mode: boolean;
  author_patreon_flair: boolean;
  author_flair_text_color: null;
  permalink: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  mod_reports: any[];
  is_video: boolean;
}
interface Media {
  reddit_video: Redditvideo;
}

interface Redditvideo {
  bitrate_kbps: number;
  fallback_url: string;
  has_audio: boolean;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}

export interface Preview {
  images: Image[];
  enabled: boolean;
}

export interface Image {
  source: Source;
  resolutions: Source[];
  variants: Mediaembed;
  id: string;
}

export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface Mediaembed {}

export interface Linkflairrichtext {
  e: string;
  t: string;
}

export interface Replies {
  kind: 'Listing';
  data: CommentListingData;
}

export interface CommentListingData {
  after: null;
  dist: null;
  modhash: string;
  geo_filter: string;
  children: (ChildComment | More)[];
  before: null;
}

export interface Authorflairrichtext {
  e: string;
  t: string;
}

export interface ChildComment {
  kind: 't1';
  data: CommentData;
}

export interface CommentData {
  subreddit_id: string;
  approved_at_utc: null;
  author_is_blocked: boolean;
  comment_type: null;
  awarders: any[];
  mod_reason_by: null;
  banned_by: null;
  author_flair_type: string;
  total_awards_received: number;
  subreddit: string;
  author_flair_template_id: null;
  distinguished: null;
  likes: null;
  replies: '' | Replies;
  user_reports: any[];
  saved: boolean;
  id: string;
  banned_at_utc: null;
  mod_reason_title: null;
  profile_img: string;
  gilded: number;
  archived: boolean;
  collapsed_reason_code: null;
  no_follow: boolean;
  author: string;
  can_mod_post: boolean;
  send_replies: boolean;
  parent_id: string;
  score: number;
  author_fullname: string;
  removal_reason: null;
  approved_by: null;
  mod_note: null;
  all_awardings: any[];
  body: string;
  edited: false | number;
  author_flair_css_class: string | null;
  name: string;
  is_submitter: boolean;
  downs: number;
  author_flair_richtext: Authorflairrichtext[] | null;
  author_patreon_flair: boolean;
  body_html: string;
  gildings: Gildings;
  collapsed_reason: null;
  link_id: string;
  associated_award: null;
  stickied: boolean;
  author_premium: boolean;
  can_gild: boolean;
  top_awarded_type: null;
  unrepliable_reason: null;
  author_flair_text_color: string | null;
  treatment_tags: any[];
  score_hidden: boolean;
  permalink: string;
  subreddit_type: string;
  locked: boolean;
  report_reasons: null;
  created: number;
  author_flair_text: string | null;
  collapsed: boolean;
  created_utc: number;
  subreddit_name_prefixed: string;
  controversiality: number;
  depth: number;
  author_flair_background_color: string | null;
  collapsed_because_crowd_control: null;
  mod_reports: any[];
  num_reports: null;
  ups: number;
}

export interface Gildings {}

export interface CommentListing {
  kind: 'Listing';
  data: CommentListingData;
}

export interface More {
  kind: 'list';
  data: MoreData;
}

export interface MoreData {
  count: number;
  name: string;
  id: string;
  parent_id: string;
  depth: number;
  children: string[];
}
