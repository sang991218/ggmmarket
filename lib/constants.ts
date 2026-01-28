export const CATEGORIES = [
  "디지털기기",
  "생활가전",
  "가구/인테리어",
  "유아동",
  "여성의류",
  "남성의류",
  "생활/가공식품",
  "스포츠/레저",
  "취미/게임/음반",
  "뷰티/미용",
  "반려동물용품",
  "도서/티켓/음반",
  "식물",
  "기타 중고물품",
  "삽니다",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PRODUCT_STATUS = ["판매중", "예약중", "판매완료"] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

export const MAX_IMAGES = 10;
