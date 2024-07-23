# LogSign

## 1. 프로젝트 내용
LogSign은 소셜 로그인과 일반 로그인을 모두 지원하는 웹 애플리케이션입니다. 사용자는 Google, Naver, Kakao를 통해 소셜 로그인을 할 수 있으며, 일반 회원가입을 통해서도 로그인할 수 있습니다. 또한, 사용자는 이메일을 통해 비밀번호 재설정 기능을 사용할 수 있습니다.

프로젝트 기간
2023.07.17 ~ (진행중)

## 2. 개발환경
- **운영체제**: Windows
- **IDE**: VScode
- **서버**: Node.js (Express)
- **저장소 관리**: GitHub
  
### Front-end
- **Language**: HTML5, CSS3, JavaScript
- **Framework**: Vue.js
- **Methodology**: Axios
  
### Back-end
- **Language**: JavaScript (Node.js)
- **Framework**: Express
- **데이터베이스**: MongoDB
- **Tool**: MongoDB Compass
  
### API
- **API 사용**:
- Google OAuth API
- Naver OAuth API
- Kakao OAuth API
- Nodemailer (이메일 전송)

## 3. 주요 기능
회원가입
일반 회원가입
소셜 회원가입 (Google, Naver, Kakao)

로그인
일반 로그인
소셜 로그인 (Google, Naver, Kakao)

비밀번호 찾기
이메일을 통한 비밀번호 재설정 링크 전송
비밀번호 재설정
기타 기능

닉네임 및 이메일 중복 확인

## 4. 설치 및 실행
### 로컬에서 프로젝트 실행하기

저장소 클론
- git clone https://github.com/username/LogSign.git

백엔드 서버 설정
- npm install
- npm start

프론트엔드 서버 설정
- npm install
- npm run serve

.env 파일 설정
프로젝트 루트에 .env 파일을 생성하고 다음 내용을 추가합니다.

- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret
- NAVER_CLIENT_ID=your_naver_client_id
- NAVER_CLIENT_SECRET=your_naver_client_secret
- KAKAO_CLIENT_ID=your_kakao_client_id
- KAKAO_CLIENT_SECRET=your_kakao_client_secret
- MONGODB_URI=your_mongodb_uri
- EMAIL_USER=your_email
- EMAIL_PASS=your_email_password

## 5. 화면 구성
메인 페이지
로고와 함께 로그인, 회원가입 버튼을 배치하여 사용자가 쉽게 접근할 수 있도록 설계

로그인 페이지
이메일과 비밀번호를 입력하여 로그인 가능
소셜 로그인 버튼을 통해 Google, Naver, Kakao 로그인 지원
아이디 찾기, 비밀번호 찾기, 회원가입 링크 제공

회원가입 페이지
일반 회원가입과 소셜 회원가입 선택 가능
약관 동의 항목
닉네임, 이메일, 비밀번호 입력 필드 제공

비밀번호 찾기 페이지
이메일을 입력하여 비밀번호 재설정 링크 요청
비밀번호 재설정 페이지로 이동하여 새로운 비밀번호 설정

## 6. 주의사항
소셜 로그인 API를 사용하기 위해 각 플랫폼의 개발자 센터에서 클라이언트 ID와 시크릿을 발급받아야 합니다.
이메일 전송 기능을 사용하려면 Nodemailer 설정을 통해 이메일 계정 정보를 .env 파일에 입력해야 합니다.
