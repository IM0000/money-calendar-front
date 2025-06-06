import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleLogo from '../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../assets/kakao/kakao_logo.webp';
// import appleLogo from '../assets/apple/apple-logo-bg.png'; // 애플 로고 경로
import discordLogo from '../assets/discord/discord_logo.png'; // 디스코드 로고 경로
import OAuthLoginButton from '../components/OAuthLoginButton';
import Logo from '../components/Logo';
import { AxiosError } from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { ERROR_CODE_MAP } from '@/constants/error.constant';

const { VITE_BACKEND_URL } = import.meta.env;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 에러 메시지 상태 추가
  const navigate = useNavigate();
  const {
    login: storeLogin,
    checkAuth,
    user,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setError('');
    try {
      await storeLogin({ email, password });
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data) {
        const { errorCode, errorMessage, data } = error.response.data;
        if (errorCode && errorMessage) {
          if (errorCode === ERROR_CODE_MAP.ACCOUNT_001) {
            alert(errorMessage);
            navigate('/users/password', {
              state: { email: data?.email },
            });
          }
          setError(errorMessage);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <Logo height="55px" divClassName="mb-8 text-black" />
      <div className="flex flex-col items-center mb-8 space-y-4 w-80">
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && (
          <div className="w-full mt-2 text-sm text-red-500">{error}</div>
        )}
        <div className="flex justify-between w-full text-sm">
          {/* <div className="flex items-center">
                <input type="checkbox" id="remember-me" className="mr-1" />
                <label htmlFor="remember-me">로그인 상태 유지</label>
              </div> */}
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            비밀번호 찾기
          </Link>
        </div>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 mt-2 text-white bg-blue-400 rounded hover:bg-blue-500"
        >
          로그인
        </button>
      </div>
      <div className="flex items-center w-64 my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="flex justify-around w-64 mb-8">
        {/*<OAuthLoginButton
          provider="애플"
          logo={appleLogo}
          onClick={handleAppleLogin}
        />*/}
        <OAuthLoginButton
          provider="구글"
          logo={googleLogo}
          onClick={handleGoogleLogin}
        />
        <OAuthLoginButton
          provider="카카오"
          logo={kakaoLogo}
          onClick={handleKakaoLogin}
        />
        <OAuthLoginButton
          provider="디스코드"
          logo={discordLogo}
          onClick={handleDiscordLogin}
        />
      </div>
      <div className="flex mt-4 space-x-4">
        <Link to="/" className="px-4 py-2 text-blue-400 hover:underline">
          비회원으로 이용하기
        </Link>
        <Link to="/sign-up" className="px-4 py-2 text-blue-400 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}

export const handleGoogleLogin = () => {
  // 구글 로그인 로직
  window.location.href = `${VITE_BACKEND_URL}/api/v1/auth/oauth/google`;
};

export const handleKakaoLogin = () => {
  // 카카오 로그인 로직
  window.location.href = `${VITE_BACKEND_URL}/api/v1/auth/oauth/kakao`;
};

export const handleAppleLogin = () => {
  // 애플 로그인 로직
  alert('준비 중입니다.');
};

export const handleDiscordLogin = () => {
  // 디스코드 로그인 로직
  window.location.href = `${VITE_BACKEND_URL}/api/v1/auth/oauth/discord`;
};
