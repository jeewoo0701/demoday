import React, { useState } from 'react';

// HELPER: Icon SVG Components (Lucide icons using inline SVG)
const GiftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-blue-500 mx-auto mb-4"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>);
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const AlertTriangleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);


// ★★★ DATA UPDATE: Reflecting real-world benefit criteria with varied questions ★★★
const BENEFIT_FLOWS = {
  basic_pension: {
    id: 'basic_pension',
    title: '기초연금',
    description: '어르신들의 안정적인 노후 생활을 돕는 핵심 지원금',
    // --- 4 Questions for Basic Pension ---
    questions: [
      { key: 'age_pension', text: '만 65세 이상 대한민국 국민이신가요?', options: ['예', '아니요'] },
      { key: 'household_status', text: '가구 형태가 어떻게 되시나요?', options: ['혼자 삽니다 (단독가구)', '배우자와 함께 삽니다 (부부가구)', '자녀 등 다른 가족과 삽니다'] },
      { key: 'income_level_pension', text: '가구의 월 소득과 재산을 합한 금액(소득인정액)이 정부 기준액 이하인가요?', options: ['예, 기준액 이하입니다', '아니요, 기준액을 초과합니다', '잘 모르겠습니다'] },
      { key: 'is_public_servant', text: '공무원/사학/군인/별정우체국 연금 수급자 또는 그 배우자이신가요?', options: ['아니요', '예'] }
    ],
    getResult: (answers) => {
      if (answers.age_pension === '예' && answers.income_level_pension === '예, 기준액 이하입니다' && answers.is_public_servant === '아니요') {
        return { eligible: true, title: '기초연금', description: '기초연금 수급 대상이실 가능성이 매우 높습니다.', details: '2025년 기준 단독가구 월 최대 334,810원, 부부가구 월 최대 535,680원이 지급될 수 있습니다. 가까운 주민센터나 국민연금공단 지사(☎️1355)에 꼭 문의하여 신청하세요.' };
      }
      return { eligible: false, title: '기초연금', description: '아쉽지만 기초연금 수급 조건에 해당되지 않을 수 있습니다.', details: '기초연금은 만 65세 이상, 소득인정액 기준을 충족해야 하며, 특정 공무원연금 수급자는 제외될 수 있습니다. 조건이 매년 바뀌니 다시 확인해보시는 것을 추천합니다.' };
    }
  },
  livelihood_benefit: {
    id: 'livelihood_benefit',
    title: '기초생활보장 생계급여',
    description: '최저 생활을 보장하기 위한 생계비 지원',
    // --- 3 Questions for Livelihood Benefit ---
    questions: [
      { key: 'household_size', text: '가구에 포함되는 총 가족 수는 몇 명인가요?', options: ['1인 가구', '2인 가구', '3인 가구', '4인 가구 이상'] },
      { key: 'monthly_income', text: '가구의 한 달 총 소득이 얼마인가요?', options: ['100만원 이하', '100만원 ~ 200만원', '200만원 ~ 300만원', '300만원 이상'] },
      { key: 'has_supporter', text: '부양의무자(1촌 직계혈족 및 그 배우자)가 없거나, 있어도 부양 능력이 없나요?', options: ['예', '아니요 (부양 가능한 가족이 있음)', '잘 모르겠습니다'] }
    ],
    getResult: (answers) => {
      // Simplified logic for example
      const income = parseInt(answers.monthly_income?.replace(/[^0-9]/g, '')) || 0;
      const household_size = parseInt(answers.household_size?.replace(/[^0-9]/g, '')) || 1;
      const income_threshold = household_size === 1 ? 710000 : 1200000; // 2025년 기준 중위소득 32% (매우 단순화된 예시)
     
      if (income <= income_threshold && answers.has_supporter === '예') {
        return { eligible: true, title: '생계급여', description: '생계급여 수급 대상이실 가능성이 있습니다.', details: '정확한 소득 및 재산 조사, 부양의무자 기준 확인이 필요합니다. 거주지 주민센터에 방문하여 상담받아보세요.' };
      }
      return { eligible: false, title: '생계급여', description: '아쉽지만 생계급여 수급 기준을 초과할 수 있습니다.', details: '생계급여는 가구의 소득인정액이 생계급여 선정기준 이하일 때 지원됩니다. 부양의무자 기준도 충족해야 하지만, 일부 완화되는 경우도 있으니 주민센터 상담을 추천합니다.' };
    }
  },
  long_term_care: {
    id: 'long_term_care',
    title: '노인장기요양보험',
    description: '몸이 불편한 어르신을 위한 돌봄(요양) 서비스 지원',
    // --- 5 Questions for Long-Term Care Insurance ---
    questions: [
        { key: 'age_care', text: '만 65세 이상이신가요? (65세 미만인 경우, 노인성 질병을 앓고 계신가요?)', options: ['만 65세 이상', '만 65세 미만, 노인성 질병 있음', '해당 없음'] },
        { key: 'daily_living', text: '혼자 힘으로 식사, 옷 입기, 화장실 가기 등 일상생활을 수행하기 어려우신가요?', options: ['매우 어렵다', '조금 어렵다', '혼자서도 잘 할 수 있다'] },
        { key: 'assistance_duration', text: '다른 사람의 도움이 필요한 상태가 얼마나 오래 지속되었나요?', options: ['6개월 이상', '6개월 미만'] },
        { key: 'is_hospitalized', text: '현재 병원에 입원 중이신가요?', options: ['아니요', '예'] },
        { key: 'residence_type', text: '주로 어디에 거주하고 계신가요?', options: ['자택', '요양원 등 시설'] }
    ],
    getResult: (answers) => {
        if (answers.age_care !== '해당 없음' && answers.daily_living !== '혼자서도 잘 할 수 있다' && answers.assistance_duration === '6개월 이상' && answers.is_hospitalized === '아니요') {
            return { eligible: true, title: '노인장기요양보험', description: '장기요양보험 등급을 신청하여 혜택을 받으실 수 있습니다!', details: '국민건강보험공단(☎️1577-1000)에 연락하여 장기요양 인정 신청을 하시면, 공단 직원이 방문하여 어르신의 심신 상태를 확인하고 등급을 판정합니다. 등급에 따라 방문요양, 주야간보호, 요양시설 입소 등의 서비스를 이용할 수 있습니다.' };
        }
        return { eligible: false, title: '노인장기요양보험', description: '아쉽지만 장기요양보험 신청 조건에 해당되지 않을 수 있습니다.', details: '장기요양보험은 6개월 이상 혼자서 일상생활을 수행하기 어려운 분을 대상으로 합니다. 병원 입원 중인 경우엔 퇴원 후 신청 가능합니다.' };
    }
  },
};


export default function App() {
  const [step, setStep] = useState('intro'); // 'intro', 'selection', 'question', 'results'
  const [name, setName] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleStart = () => {
    // Custom error handling instead of alert()
    if (name.trim() === '') {
      // Using a simple state to show an error message instead of alert()
      document.getElementById('name-input-error').textContent = '이름을 입력해주세요.';
      return;
    }
    document.getElementById('name-input-error').textContent = '';
    setStep('selection');
  };

  const handleFlowSelect = (flowId) => {
    setSelectedFlow(flowId);
    setStep('question');
  };

  const handleAnswer = (key, option) => {
    const newAnswers = { ...answers, [key]: option };
    setAnswers(newAnswers);

    const questions = BENEFIT_FLOWS[selectedFlow].questions;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalResult = BENEFIT_FLOWS[selectedFlow].getResult(newAnswers);
      setResult(finalResult);
      setStep('results');
    }
  };

  const restart = () => {
    setStep('selection');
    setSelectedFlow(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const ProgressIndicator = () => {
    const questions = BENEFIT_FLOWS[selectedFlow]?.questions || [];
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    return (
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center py-8 px-4 font-['Inter']">
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 transition-all">
       
        {step === 'intro' && <IntroScreen name={name} setName={setName} onStart={handleStart} />}

        {step === 'selection' && <SelectionScreen name={name} onSelect={handleFlowSelect} />}

        {step === 'question' && selectedFlow && (
          <div>
            <ProgressIndicator />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 text-center">
              {BENEFIT_FLOWS[selectedFlow].questions[currentQuestionIndex].text}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {BENEFIT_FLOWS[selectedFlow].questions[currentQuestionIndex].options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswer(BENEFIT_FLOWS[selectedFlow].questions[currentQuestionIndex].key, option)}
                  className="w-full text-base md:text-lg text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
       
        {step === 'results' && result && <ResultsScreen result={result} onRestart={restart} name={name} answers={answers} />}

        <footer className="text-center text-gray-500 mt-6 text-xs">
          <p>본 서비스는 예상 정보이며, 실제 혜택은 상세 조건에 따라 달라질 수 있습니다.</p>
        </footer>
      </div>
    </div>
  );
}

// Screen 1: Intro Screen for name input
function IntroScreen({ name, setName, onStart }) {
  return (
    <div className="text-center">
      <GiftIcon />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4 mb-1">숨어있는 내 복지 혜택,</h1>
      <h1 className="text-3xl font-bold tracking-tight text-blue-600 mb-4">30초 만에 찾아보세요!</h1>
      <p className="text-gray-600 mb-6 text-sm">
        정확한 안내를 위해 먼저 성함을 입력해주세요.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력해주세요"
        className="w-full text-base md:text-lg border-2 border-slate-300 rounded-lg p-3 mb-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      />
      {/* Custom error message location */}
      <p id="name-input-error" className="text-red-500 text-sm mb-3 h-5"></p>
      <button
        onClick={onStart}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-md text-lg transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        혜택 확인 시작하기 💸
      </button>
    </div>
  );
}

// Screen 2: Benefit Selection Screen
function SelectionScreen({ name, onSelect }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
        <span className="text-blue-600">{name}</span>님, 반갑습니다!
      </h1>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">어떤 혜택이 궁금하세요?</h2>
      <p className="text-gray-600 mb-8 text-sm">
        알아보고 싶은 항목을 선택하면 바로 자격 여부를 알려드려요.
      </p>
      <div className="space-y-4">
        {Object.values(BENEFIT_FLOWS).map(flow => (
          <button
            key={flow.id}
            onClick={() => onSelect(flow.id)}
            className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-lg transition-all"
          >
            <p className="font-bold text-lg text-blue-700">{flow.title}</p>
            <p className="text-sm text-gray-600">{flow.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Screen 3: Results Screen with Subscription Form
function ResultsScreen({ result, onRestart, name, answers }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-center text-gray-900 mb-6">
        <span className="text-blue-600">{name}</span>님의 '{result.title}' 확인 결과입니다!
      </h2>

      {result.eligible ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow-sm">
          <div className="flex justify-center"><CheckCircleIcon /></div>
          <h3 className="font-bold text-xl text-green-800 mt-3">혜택을 받으실 수 있어요!</h3>
          <p className="text-gray-700 mt-2">{result.description}</p>
          <p className="text-xs text-gray-600 mt-4 bg-green-100 p-2 rounded">{result.details}</p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center shadow-sm">
          <div className="flex justify-center"><AlertTriangleIcon /></div>
          <h3 className="font-bold text-xl text-yellow-800 mt-3">지금은 해당되지 않아요</h3>
          <p className="text-gray-700 mt-2">{result.description}</p>
          <p className="text-xs text-gray-600 mt-4 bg-yellow-100 p-2 rounded">{result.details}</p>
        </div>
      )}
     
      <SubscriptionForm answers={answers} name={name} result={result} />

      <button
        onClick={onRestart}
        className="w-full mt-8 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-transform active:scale-[0.99]"
      >
        다른 혜택 알아보기
      </button>
    </div>
  );
}

// Component for Google Sheets integration
function SubscriptionForm({ answers, name, result }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple client-side validation, using state instead of alert()
    if (!/^\d{10,11}$/.test(phone.replace(/-/g, ''))) {
      setErrorMsg('올바른 휴대폰 번호 10~11자리를 입력해주세요.');
      return;
    }
    setErrorMsg('');
    setStatus('submitting');
   
    // !!! IMPORTANT !!! Replaced with the URL from VITE_GAS_ENDPOINT
    const SCRIPT_URL = import.meta.env.VITE_GAS_ENDPOINT; 

    // This object structure is flexible.
    // The smart Apps Script will create columns for any new keys sent from here.
    const formData = {
      timestamp: new Date().toLocaleString('ko-KR'),
      name,
      phone,
      benefitTitle: result.title, // Key field to distinguish the benefit type
      ...answers,
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Must be 'no-cors' for Google Apps Script deployment
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(() => {
        // Since mode is 'no-cors', we can't reliably check the response status (it will always be opaque)
        // We assume success here after the request is sent without immediate network errors.
        setStatus('success');
        setPhone('');
      })
      .catch(err => {
        console.error('Error submitting form:', err);
        setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (콘솔 로그 확인)');
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
      <h3 className="font-bold text-lg text-gray-900">새로운 복지 소식을 가장 먼저 받아보세요!</h3>
      <p className="text-gray-700 mt-2 mb-4 text-sm">
        신청 기간을 놓치거나, 나에게 맞는 새로운 혜택이 생겼을 때 알림을 보내드려요.
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
