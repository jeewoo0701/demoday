import React, { useState } from 'react';

// HELPER: 아이콘 SVG 컴포넌트들
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
);
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

// 데이터: 질문 목록
const QUESTIONS = [
  { key: 'age', text: '만 나이가 어떻게 되시나요?', options: ['50-59세', '60-64세', '65-74세', '75세 이상'] },
  { key: 'region', text: '어디에 거주하고 계신가요?', options: ['서울', '그 외 지역'] },
  { key: 'household', text: '가구 형태는 어떻게 되시나요?', options: ['혼자 산다', '배우자와 함께 산다'] },
  { key: 'income', text: '부부 합산 월 소득은 어느 정도이신가요?', options: ['150만원 미만', '150만원 ~ 300만원', '300만원 이상'] },
];

// 데이터: 복지 혜택 정보 및 조건 (MVP 단순화)
const ALL_BENEFITS = [
  {
    id: 'basic_pension',
    title: '기초연금',
    description: '어르신들의 안정적인 소득 기반을 위한 제도로, 월 최대 약 33만원이 지급될 수 있습니다.',
    details: '만 65세 이상, 소득 하위 70%에 해당될 경우 신청 가능합니다.',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age >= 65 && answers.income !== '300만원 이상';
    },
    category: '지금 받을 수 있는 혜택 💰'
  },
  {
    id: 'telecom_discount',
    title: '통신비 감면',
    description: '기초연금 수급자이신 경우, 월 최대 11,000원의 통신요금을 감면받을 수 있습니다.',
    details: '기초연금 대상자라면 통신사 고객센터(☎️114)를 통해 간편하게 신청할 수 있습니다.',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age >= 65 && answers.income !== '300만원 이상';
    },
    category: '지금 받을 수 있는 혜택 💰'
  },
  {
    id: 'transport_discount',
    title: '교통비 지원',
    description: '만 65세 이상 어르신은 지하철을 무료로 이용할 수 있으며, 지자체별로 버스 요금 할인도 제공됩니다.',
    details: '가까운 주민센터에서 어르신 교통카드를 발급받으세요.',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age >= 65;
    },
    category: '지금 받을 수 있는 혜택 💰'
  },
  {
    id: 'energy_voucher',
    title: '전기요금 및 에너지바우처',
    description: '저소득 어르신 가구에 전기, 도시가스, 난방비 등 에너지 비용을 지원합니다.',
    details: '소득 및 가구원 특성 기준 충족 시 신청 가능하며, 주민센터에 문의가 필요합니다.',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age >= 65 && answers.income === '150만원 미만';
    },
    category: '지금 받을 수 있는 혜택 💰'
  },
  {
    id: 'seoul_support',
    title: '서울시 어르신 추가 지원',
    description: '서울시에 거주하는 어르신을 위해 추가적인 생활 안정 지원금이 있을 수 있습니다.',
    details: '매년 정책이 달라지므로, 거주하시는 구청이나 주민센터의 공지를 확인하는 것이 좋습니다.',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age >= 65 && answers.region === '서울';
    },
    category: '지금 받을 수 있는 혜택 💰'
  },
  {
    id: 'pre_welfare',
    title: '예비 복지 안내',
    description: '곧 다가올 65세를 대비하여 미리 알아두면 좋은 혜택들입니다.',
    details: '기초연금, 교통비 지원 등은 만 65세부터 적용됩니다. 지금부터 미리 준비하고 계획하여 모든 혜택을 놓치지 마세요!',
    isEligible: (answers) => {
      const age = parseInt(answers.age?.slice(0, 2));
      return age < 65;
    },
    category: '미리 준비하면 좋은 혜택 💎'
  }
];

// App: 메인 애플리케이션 컴포넌트
export default function App() {
  const [step, setStep] = useState('intro'); // 'intro', 'question', 'results'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [eligibleBenefits, setEligibleBenefits] = useState([]);
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim() === '') {
      alert('이름을 입력해주세요.');
      return;
    }
    setStep('question');
  };

  const handleAnswer = (key, option) => {
    const newAnswers = { ...answers, [key]: option };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
      setStep('results');
    }
  };

  const calculateResults = (finalAnswers) => {
    const results = ALL_BENEFITS.filter(benefit => benefit.isEligible(finalAnswers));
    setEligibleBenefits(results);
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEligibleBenefits([]);
    setName('');
  };

  const ProgressIndicator = () => (
    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8 overflow-hidden">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center py-8 px-4">
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 transition-all">
        
        {/* 기존의 Tailwind Active 뱃지 삭제됨 */}

        {step === 'intro' && (
          <IntroScreen name={name} setName={setName} onStart={handleStart} />
        )}

        {step === 'question' && (
          <div>
            <ProgressIndicator />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 text-center">
              {QUESTIONS[currentQuestionIndex].text}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {QUESTIONS[currentQuestionIndex].options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswer(QUESTIONS[currentQuestionIndex].key, option)}
                  className="w-full text-base md:text-lg text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'results' && (
          <ResultsScreen name={name} benefits={eligibleBenefits} answers={answers} onRestart={restart} />
        )}

        <footer className="text-center text-gray-500 mt-6 text-xs">
          <p>본 서비스는 공공데이터를 기반으로 한 예상 정보이며, 실제 혜택은 소득, 재산 등 상세 조건에 따라 달라질 수 있습니다.</p>
        </footer>
      </div>
    </div>
  );
}

// IntroScreen: 시작 화면 컴포넌트
function IntroScreen({ name, setName, onStart }) {
  return (
    <div className="text-center">
      <GiftIcon />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4 mb-1">숨어있는 내 복지 혜택,</h1>
      <h1 className="text-3xl font-bold tracking-tight text-blue-600 mb-4">30초 만에 찾아보세요!</h1>
      <p className="text-gray-600 mb-6 text-sm">
        몇 가지 질문에만 답하면 나와 우리 부모님이 받을 수 있는 혜택을 쉽고 빠르게 알려드립니다.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력해주세요"
        className="w-full text-base md:text-lg border-2 border-slate-300 rounded-lg p-3 mb-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      />
      <button
        onClick={onStart}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-md text-lg transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        내 혜택 확인하기 💸
      </button>
    </div>
  );
}

// ResultsScreen: 결과 화면 컴포넌트
function ResultsScreen({ name, benefits, answers, onRestart }) {
  const groupedBenefits = benefits.reduce((acc, benefit) => {
    const category = benefit.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(benefit);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-center text-gray-900">
        <span className="text-blue-600">{name}</span> 님을 위한
      </h2>
      <h2 className="text-2xl font-bold tracking-tight text-center text-gray-900 mb-6">맞춤 복지 혜택 결과입니다!</h2>

      {Object.keys(groupedBenefits).map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 border-b pb-2 border-slate-200">{category}</h3>
          {groupedBenefits[category].map(benefit => (
            <div key={benefit.id} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 mb-3 shadow-sm">
              <h4 className="font-bold text-lg text-blue-700">{benefit.title}</h4>
              <p className="text-gray-700 text-sm mt-1">{benefit.description}</p>
              <p className="text-xs text-gray-600 mt-2 bg-slate-100 p-2 rounded">{benefit.details}</p>
            </div>
          ))}
        </div>
      ))}

      {benefits.length === 0 && (
        <div className="text-center bg-gray-50 border border-slate-200 p-6 rounded-xl">
          <AlertTriangleIcon />
          <p className="mt-2 text-gray-800 font-semibold">현재 조건에 맞는 혜택을 찾지 못했습니다.</p>
          <p className="text-sm text-gray-600 mt-1">하지만 복지 정책은 계속 바뀌니, 새로운 소식을 받아보시는 걸 추천드려요!</p>
        </div>
      )}

      <SubscriptionForm answers={answers} name={name} />

      <button
        onClick={onRestart}
        className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        처음부터 다시하기
      </button>
    </div>
  );
}

// SubscriptionForm: 구글 시트 연동을 위한 전화번호 입력 폼
function SubscriptionForm({ answers, name }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 간단한 전화번호 형식 검증
    if (!/^\d{10,11}$/.test(phone.replace(/-/g, ''))) {
      alert('올바른 휴대폰 번호 10~11자리를 입력해주세요.');
      return;
    }

    setStatus('submitting');

    // !!! 중요 !!!
    // 아래 URL은 직접 생성한 Google Apps Script 웹 앱 URL로 교체해야 합니다.
    const SCRIPT_URL = import.meta.env.VITE_GAS_ENDPOINT;

    const formData = {
      timestamp: new Date().toLocaleString('ko-KR'),
      name,
      phone,
      ...answers,
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Script는 CORS 응답을 제대로 처리하지 않으므로 no-cors 모드 사용
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(() => {
        setStatus('success');
        setPhone('');
      })
      .catch(err => {
        console.error('Error:', err);
        setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setStatus('error');
      });
  };

  if (status === 'success') {
    return (
      <div className="mt-8 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center">
        <div className="flex justify-center"><CheckCircleIcon /></div>
        <p className="font-bold mt-2">신청이 완료되었습니다!</p>
        <p className="text-sm">새로운 복지 혜택이 생기면 가장 먼저 알려드릴게요.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-blue-50/70 border-2 border-blue-200 border-dashed p-6 rounded-xl text-center">
      <h3 className="font-bold text-lg text-gray-900">복지 정책, 매년 바뀌는 것 알고 계셨나요?</h3>
      <p className="text-gray-700 mt-2 mb-4 text-sm">
        신청 기간을 놓치거나, 나에게 맞는 새로운 혜택이 생겼을 때 가장 먼저 알림을 받아보세요.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="알림 받을 휴대폰 번호 ('-' 없이 입력)"
          className="w-full text-base md:text-lg border-2 border-slate-300 rounded-lg p-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:bg-slate-100"
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? '신청하는 중...' : '무료로 알림 받기 🔔'}
        </button>
        {status === 'error' && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
