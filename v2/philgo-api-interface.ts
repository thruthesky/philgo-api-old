export const CODE_PRIMARY_PHOTO = 'primary_photo';

export interface PHILGO_API_RESPONSE {
    acl?: string;
    action?: string;
    code?: number;
    domain?: string;
    event?: any;
    id?: string;
    idx_member?: string;
    message?: string;
    mode?: string;
    module?: string;
    post_id?: string;
    post_name?: string;
    register_mode?: string;
    session_id?: string;
    site?: string;
    user_id?: any;
    user_name?: string;
    user_stamp?: string;
    user_url_primary_photo?: string; // for user primary photo.
    version?: string;
    idx?: any; // for post/comment update.
};
export interface PHILGO_RESPONSE extends PHILGO_API_RESPONSE {};

export interface MEMBER_DATA extends PHILGO_API_RESPONSE {
    idx?: string;
    stamp?: string;
  id : string;
  nickname : string;
  password: string;
  name: string;
  email: string;
  mobile?: string;
  landline?: string;
  gender?: string;
  birth_year?:string;
  birth_month?:string;
  birth_day?:string;
  birthday?: string;

  address?: string;
  city?: string;
  province?: string;
  country?: string;
  race?: string;
  children?: string;
  height?: number;
  weight?: number;
  eye_color?: string;
  hair_color?: string;
  religion?: string;
  relationship?: string;
  smoking?: string;
  drinking?: string;
  look_for?: string;
  greeting?: string;
  signature?: string;
  namecard_title?: string;
  namecard_company_name?: string;
  namecard_name?: string;
  namecard_line?: string;
  namecard_address?: string;
  namecard_landline?: string;
  namecard_mobile?: string;
  namecard_homepage?: string;
  namecard_email?: string;

  int_1?: string;
  int_2?: string;
  int_3?: string;
  int_4?: string;
  int_5?: string;
  int_6?: string;
  int_7?: string;
  int_8?: string;
  int_9?: string;
  int_10?: string;

  char_1?: string;
  char_2?: string;
  char_3?: string;
  char_4?: string;
  char_5?: string;
  char_6?: string;
  char_7?: string;
  char_8?: string;
  char_9?: string;
  char_10?: string;

  varchar_1?: string;
  varchar_2?: string;
  varchar_3?: string;
  varchar_4?: string;
  varchar_5?: string;
  varchar_6?: string;
  varchar_7?: string;
  varchar_8?: string;
  varchar_9?: string;
  varchar_10?: string;

  text_1?: string; // as url of photo
  text_2?: string;
  text_3?: string;
  text_4?: string;
  text_5?: string;
};


export interface MEMBER_LOGIN_DATA {
    idx?: string;
    stamp?: string;
    id: string;             // member.id
    password?: string;      // member.password
    // idx?: string;           // member.idx. 회원 번호가 없이, 회원 아이디 + 세션 아이디로 로그인 가능하다.
    session_id?: string;    // member session_id
};
export interface MEMBER_LOGIN extends MEMBER_LOGIN_DATA {};


export interface MEMBER_REGISTER_DATA extends MEMBER_DATA {

};

export interface MEMBER_REGISTER_RESPONSE_DATA extends PHILGO_API_RESPONSE {

};



export interface FILE_UPLOAD_DATA {
    code: string;
    idx: number;
    name: string;
    path: string;
    result: number;
    error?: string;
    src_org: string;
    url: string;
    url_thumbnail: string;
    gid?: string; // @Warning 'gid' is not returned from server. you must keep it by yourself.
};
export interface FILE_UPLOAD_RESPONSE extends PHILGO_API_RESPONSE {
    data: FILE_UPLOAD_DATA;
};

export interface FILE_DELETE_RESPONSE extends PHILGO_API_RESPONSE {
    data: {
        code: number;
        idx: number;
        message?: string;
    }
}



export interface SEARCH_QUERY_DATA {
    fields: string;
    from: string;
    on?: string;
    where?: string;
    orderby?: string;
    limit?: string;
    page?: number;
    post?: number;
};

export interface PAGE_DATA {
    post_id: string;
    page_no?: number;
    fields?: string;
    limit?: number;
    expire?: number;
};

export interface PAGE_OPTION extends PAGE_DATA {}


export interface PHOTO_OPTION {
    post_id?: string;
    limit?: number;
};


export interface POST_AD {
    deleted: string;
    done_htmlspecialchars: number;
    idx: string;
    no_of_first_image: string;
    post_id: string;
    src: string;
    src_thumbnail: string;
    subject: string;
    url: string;
};

export interface POST_TOP_AD {
    category: string;
    gid: string;
    idx: string;
    idx_file: string;
    int_4: string;
    src: string;
    sub_category: string;
    url: string;
    varchar_5: string;
    varchar_11: string;
};

export interface POST_TOP_PREMIUM_AD {
    idx: string;
    image_src: string;
    no_of_view: string;
    region: string;
    src: string;
    sub_subject: string;
    subject: string;
    url: string;
    varchar_5: string;
    varchar_11: string;
    varchar_15: string;
    varchar_19: string;
};

export interface MEMBER {
    id: string;
    name: string;
    nickname: string;
};


export interface PHOTOS {
    idx: number;
    src?: string; // deprecated. remove this.
    original_src?: string; // deprecated. remove this.
    url?: string;
    url_thumbnail?: string;
};



export interface COMMENT {
    bad?: string;
    blind?: string;
    content: string;
    deleted?: string;
    depth?: string;
    gid: string;
    good?: string;
    idx?: string;
    idx_member?: string;
    idx_parent: string;
    idx_root?: string;
    int_10?: string;
    member?: MEMBER;
    photos?: Array<PHOTOS>;
    post_id?: string;
    stamp?: string;
    user_name?: string;
};

export interface POST {
    bad: string;
    blind: string;
    category: string;
    comments: Array<COMMENT>;
    content: string;
    deleted: string;
    depth: string;
    gid: string;
    good: string;
    idx: string;
    idx_member: string;
    idx_parent: string;
    idx_root: string;
    int_10: string;
    link: string;
    member: MEMBER;
    no_of_comment: string;
    no_of_view: string;
    photos: Array< PHOTOS >;
    post_id: string;
    stamp: string;
    subject: string;
    user_name: string;
    url?: string;
};

/**
 * 2016-12-16 기존 POSTS interface 의 이름이 잘못되었음. 그래서 POSTS 를 PAGES 로 변경하고, 새로운 POSTS 를 만들었음.
 */
export type POSTS = Array<POST>;
export interface PAGE extends PHILGO_API_RESPONSE {
    ads: Array<POST_AD>;
    page_no: number;
    post_id: string;
    post_name: string;
    post_top_ad: Array<POST_TOP_AD>;
    post_top_premium_ad: Array<POST_TOP_PREMIUM_AD>;
    posts: POSTS;
};
//export interface PAGE extends POSTS {} // correct naming.
export type PAGES = Array<PAGE>; // correct naming for array of page.




/**
 * Post data structure for create/update
 */
export interface POST_DATA {
    module?: string; // for crate/update
    action?: string; // for create/update
    id?: string; // user id to create/update.
    session_id?: string; // user id to create or update.
    idx?
    stamp?
    idx_member?
    idx_root?
    idx_parent?
    list_order?
    depth?
    gid?
    post_id?
    group_id?
    category?
    sub_category?
    reminder?
    secret?
    checked?
    checked_stamp?
    report?
    blind?
    no_of_comment?
    no_of_attach?
    no_of_first_image?
    user_domain?
    user_id?
    user_password?
    user_name?
    user_email?
    subject?
    content?
    content_stripped?
    link?
    stamp_update?
    stamp_last_comment?
    deleted?
    no_of_view?
    good?
    bad?
    access_code?
    region?
    photos?
    int_1?
    int_2?
    int_3?
    int_4?
    int_5?
    int_6?
    int_7?
    int_8?
    int_9?
    int_10?
    char_1?
    char_2?
    char_3?
    char_4?
    char_5?
    char_6?
    char_7?
    char_8?
    char_9?
    char_10?
    varchar_1?
    varchar_2?
    varchar_3?
    varchar_4?
    varchar_5?
    varchar_6?
    varchar_7?
    varchar_8?
    varchar_9?
    varchar_10?
    varchar_11?
    varchar_12?
    varchar_13?
    varchar_14?
    varchar_15?
    varchar_16?
    varchar_17?
    varchar_18?
    varchar_19?
    varchar_20?
    text_1?
    text_2?
    text_3?
    text_4?
    text_5?
    text_6?
    text_7?
    text_8?
    text_9?
    text_10?
};

export interface POST_RESPONSE extends PHILGO_API_RESPONSE {
    post: POST_DATA;
};
