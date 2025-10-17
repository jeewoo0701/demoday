import React, { useState, useEffect } from 'react';
import ReactGA from "react-ga4";

// HELPER: Icon SVG Components
const GiftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-blue-500 mx-auto mb-4"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>);
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const AlertTriangleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const BackArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );

// [GA] .env 파일에 저장된 GA 측정 ID를 가져옵니다.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// [GA] GA 초기화
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

const BENEFIT_FLOWS = {
  basic_pension: {
    id: 'basic_pension',
    title: '기초연금',
    description: '어르신들의 안정적인 노후 생활을 돕는 핵심 지원금',
    questions: [
      { key: 'age_pension', text: '만 65세 이상 대한민국 국민이신가요?', options: ['예', '아니요'] },
      { key: 'household_status', text: '가구 형태가 어떻게 되시나요?', options: ['혼자 삽니다 (단독가구)', '배우자와 함께 삽니다 (부부가구)', '자녀 등 다른 가족과 삽니다'] },
      { key: 'income_level_pension', text: '가구의 월 소득과 재산을 합한 금액(소득인정액)이 정부 기준액 이하인가요?', options: ['예, 기준액 이하입니다', '아니요, 기준액을 초과합니다', '잘 모르겠습니다'] },
      { key: 'is_public_servant', text: '공무원/사학/군인/별정우체국 연금 수급자 또는 그 배우자이신가요?', options: ['아니요', '예'] }
    ],
    getResult: (answers) => {
      if (answers.age_pension === '예' && answers.income_level_pension === '예, 기준액 이하입니다' && answers.is_public_servant === '아니요') {
        return { eligible: true, title: '기초연금', description: '기초연금 수급 대상이실 가능성이 매우 높습니다.', details: '2025년 기준 단독가구 월 최대 334,810원, 부부가구 월 최대 535,680원이 지급될 수 있습니다. 가까운 주민센터나 국민연금공단 지사(☎️1355)에 꼭 문의하여 신청하세요.', link: 'https://www.bokjiro.go.kr/ssis-tbu/index.do', linkText: '✅ 복지로 홈페이지 가기' };
      }
      return { eligible: false, title: '기초연금', description: '아쉽지만 기초연금 수급 조건에 해당되지 않을 수 있습니다.', details: '기초연금은 만 65세 이상, 소득인정액 기준을 충족해야 하며, 특정 공무원연금 수급자는 제외될 수 있습니다. 조건이 매년 바뀌니 다시 확인해보시는 것을 추천합니다.' };
    }
  },
  livelihood_benefit: {
    id: 'livelihood_benefit',
    title: '기초생활보장 생계급여',
    description: '최저 생활을 보장하기 위한 생계비 지원',
    questions: [
      { key: 'household_size', text: '가구에 포함되는 총 가족 수는 몇 명인가요?', options: ['1인 가구', '2인 가구', '3인 가구', '4인 가구 이상'] },
      { key: 'monthly_income', text: '가구의 한 달 총 소득이 얼마인가요?', options: ['100만원 이하', '100만원 ~ 200만원', '200만원 ~ 300만원', '300만원 이상'] },
      { key: 'has_supporter', text: '부양의무자(1촌 직계혈족 및 그 배우자)가 없거나, 있어도 부양 능력이 없나요?', options: ['예', '아니요 (부양 가능한 가족이 있음)', '잘 모르겠습니다'] }
    ],
    getResult: (answers) => {
      const income = parseInt(answers.monthly_income?.replace(/[^0-9]/g, '')) || 0;
      const household_size = parseInt(answers.household_size?.replace(/[^0-9]/g, '')) || 1;
      const income_threshold = household_size === 1 ? 710000 : 1200000;
      if (income <= income_threshold && answers.has_supporter === '예') {
        return { eligible: true, title: '생계급여', description: '생계급여 수급 대상이실 가능성이 있습니다.', details: '정확한 소득 및 재산 조사, 부양의무자 기준 확인이 필요합니다. 거주지 주민센터에 방문하여 상담받아보세요.', link: 'https://www.bokjiro.go.kr/ssis-tbu/index.do', linkText: '✅ 복지로 홈페이지 가기' };
      }
      return { eligible: false, title: '생계급여', description: '아쉽지만 생계급여 수급 기준을 초과할 수 있습니다.', details: '생계급여는 가구의 소득인정액이 생계급여 선정기준 이하일 때 지원됩니다. 부양의무자 기준도 충족해야 하지만, 일부 완화되는 경우도 있으니 주민센터 상담을 추천합니다.' };
    }
  },
  long_term_care: {
    id: 'long_term_care',
    title: '노인장기요양보험',
    description: '몸이 불편한 어르신을 위한 돌봄(요양) 서비스 지원',
    questions: [
        { key: 'age_care', text: '만 65세 이상이신가요? (65세 미만인 경우, 노인성 질병을 앓고 계신가요?)', options: ['만 65세 이상', '만 65세 미만, 노인성 질병 있음', '해당 없음'] },
        { key: 'daily_living', text: '혼자 힘으로 식사, 옷 입기, 화장실 가기 등 일상생활을 수행하기 어려우신가요?', options: ['매우 어렵다', '조금 어렵다', '혼자서도 잘 할 수 있다'] },
        { key: 'assistance_duration', text: '다른 사람의 도움이 필요한 상태가 얼마나 오래 지속되었나요?', options: ['6개월 이상', '6개월 미만'] },
        { key: 'is_hospitalized', text: '현재 병원에 입원 중이신가요?', options: ['아니요', '예'] },
        { key: 'residence_type', text: '주로 어디에 거주하고 계신가요?', options: ['자택', '요양원 등 시설'] }
    ],
    getResult: (answers) => {
        if (answers.age_care !== '해당 없음' && answers.daily_living !== '혼자서도 잘 할 수 있다' && answers.assistance_duration === '6개월 이상' && answers.is_hospitalized === '아니요') {
            return { eligible: true, title: '노인장기요양보험', description: '장기요양보험 등급을 신청하여 혜택을 받으실 수 있습니다!', details: '국민건강보험공단(☎️1577-1000)에 연락하여 장기요양 인정 신청을 하시면, 공단 직원이 방문하여 어르신의 심신 상태를 확인하고 등급을 판정합니다. 등급에 따라 방문요양, 주야간보호, 요양시설 입소 등의 서비스를 이용할 수 있습니다.', link: 'https://www.longtermcare.or.kr/npbs/index.jsp', linkText: '✅ 노인장기요양보험 홈페이지' };
        }
        return { eligible: false, title: '노인장기요양보험', description: '아쉽지만 장기요양보험 신청 조건에 해당되지 않을 수 있습니다.', details: '장기요양보험은 6개월 이상 혼자서 일상생활을 수행하기 어려운 분을 대상으로 합니다. 병원 입원 중인 경우엔 퇴원 후 신청 가능합니다.' };
    }
  },
  assistive_devices: {
    id: 'assistive_devices',
    title: '정부 지원 복지용구 이용',
    description: '연 160만원 한도 내 보조기구 구입/대여 지원',
    questions: [
      { key: 'age_devices', text: '현재 만 65세 이상이신가요?', options: ['예', '아니요'] },
      { key: 'long_term_care_grade', text: '장기요양보험 등급(1~5등급)을 받으신 적이 있나요?', options: ['예', '아니요', '모르겠음'] },
      { key: 'mobility_issues', text: '거동이 불편하시거나 보행보조기, 휠체어 등이 필요하신가요?', options: ['예', '아니요'] }
    ],
    getResult: (answers) => {
      if (answers.age_devices === '예' && answers.mobility_issues === '예') {
        const tip = answers.long_term_care_grade === '예' ? '이미 등급이 있으시니, 가까운 복지용구사업소와 상담하여 필요한 용구를 신청하세요.' : '등급이 없으시다면 국민건강보험공단(☎️1577-1000)에 ‘장기요양 인정신청’을 먼저 진행하세요.';
        return { eligible: true, title: '복지용구 이용 지원', description: '복지용구 지원 혜택을 받으실 가능성이 높습니다.', details: `📍 지원 내용:\n연 160만원 한도 내 복지용구 구입 또는 대여 가능\n(장기요양 1~5등급 필요)\n\n🏢 신청처:\n국민건강보험공단 / 주민센터 복지과\n\n💬 Tip:\n${tip}`, link: 'https://www.longtermcare.or.kr/npbs/index.jsp', linkText: '✅ 노인장기요양보험 홈페이지' };
      }
      return { eligible: false, title: '복지용구 이용 지원', description: '아쉽지만 지원 대상이 아닐 수 있습니다.', details: '복지용구 지원은 기본적으로 만 65세 이상, 거동이 불편하여 장기요양등급을 받으신 분을 대상으로 합니다.' };
    }
  },
  utility_discounts: {
    id: 'utility_discounts',
    title: '통신/공공요금 감면',
    description: '매월 통신비, 전기, 수도요금 할인 혜택',
    questions: [
      { key: 'age_utility', text: '현재 만 65세 이상이신가요?', options: ['예', '아니요'] },
      { key: 'is_recipient', text: '기초연금 또는 기초생활수급 대상자이신가요?', options: ['예', '아니요', '모르겠음'] },
      { key: 'is_owner', text: '휴대폰, 인터넷, 전기요금 등의 명의가 본인으로 되어 있나요?', options: ['예', '아니요'] }
    ],
    getResult: (answers) => {
      if (answers.age_utility === '예' && answers.is_recipient === '예' && answers.is_owner === '예') {
        return { eligible: true, title: '통신/공공요금 감면', description: '통신요금 등 각종 요금 감면 대상자입니다.', details: `📍 지원 내용:\n월 최대 11,000원 수준 통신요금 감면, 전기·수도요금 할인 등\n\n🏢 신청처:\n주민센터, 통신사 고객센터(114), 한전(123)\n\n💬 Tip:\n하나의 기관에서 모든 감면을 한 번에 신청하는 '정부24 원스톱 서비스'를 이용하면 편리합니다.`, link: 'https://plus.gov.kr/', linkText: '✅ 정부24 홈페이지 가기' };
      }
      return { eligible: false, title: '통신/공공요금 감면', description: '아쉽지만 감면 대상이 아닐 수 있습니다.', details: '통신요금 감면은 주로 만 65세 이상 기초연금/기초생활수급자를 대상으로 하며, 서비스 명의가 본인이어야 신청 가능합니다.' };
    }
  },
  dental_care: {
    id: 'dental_care',
    title: '임플란트/틀니 지원',
    description: '건강보험 적용으로 치과 치료비 부담 절감',
    questions: [
      { key: 'age_dental', text: '현재 만 65세 이상이신가요?', options: ['예', '아니요'] },
      { key: 'need_dental_work', text: '치아 상태가 좋지 않아 임플란트나 틀니가 필요하신가요?', options: ['예', '아니요'] },
      { key: 'is_medical_aid', text: '의료급여 수급자이신가요?', options: ['예', '아니요'] }
    ],
    getResult: (answers) => {
      if (answers.age_dental === '예' && answers.need_dental_work === '예') {
        const burden = answers.is_medical_aid === '예' ? '1종 5%, 2종 15% 수준' : '약 30%';
        return { eligible: true, title: '임플란트/틀니 지원', description: '건강보험 임플란트/틀니 지원이 가능합니다.', details: `📍 지원 내용:\n평생 2개까지 임플란트, 부분/전체틀니 급여 적용\n\n🏥 본인부담률: ${burden}\n\n💬 Tip:\n시술 전 치과에 건강보험 적용 대상인지 꼭 확인하고 상담받으세요.`, link: 'https://www.nhis.or.kr/', linkText: '✅ 건강보험공단 홈페이지' };
      }
      return { eligible: false, title: '임플란트/틀니 지원', description: '아쉽지만 지원 대상이 아닐 수 있습니다.', details: '건강보험 임플란트/틀니 지원은 만 65세 이상 어르신을 대상으로 합니다.' };
    }
  },
  pneumococcal_vaccine: {
    id: 'pneumococcal_vaccine',
    title: '폐렴구균 무료 예방접종',
    description: '만 65세 이상 어르신 대상 1회 무료 접종',
    questions: [
      { key: 'age_vaccine', text: '올해 만 65세가 되셨거나, 그 이상이신가요?', options: ['예', '아니요'] },
      { key: 'is_vaccinated', text: '과거에 폐렴구균(PPSV23) 예방접종을 맞으신 적이 있나요?', options: ['아니요 또는 모르겠음', '예'] }
    ],
    getResult: (answers) => {
      if (answers.age_vaccine === '예' && answers.is_vaccinated === '아니요 또는 모르겠음') {
        return { eligible: true, title: '폐렴구균 무료 예방접종', description: '무료 폐렴구균 예방접종 대상자입니다!', details: `📍 지원 내용:\n만 65세 이상 어르신께 폐렴구균(PPSV23) 백신 1회 무료 접종\n\n🏢 접종처:\n전국 지정 의료기관 또는 보건소\n\n💬 Tip:\n접종 전 병원에 미리 연락하여 백신 보유 여부를 확인하고 방문하세요.`, link: 'https://nip.kdca.go.kr/irgd/index.html', linkText: '✅ 예방접종도우미 홈페이지' };
      }
      return { eligible: false, title: '폐렴구균 무료 예방접종', description: '아쉽지만 무료 접종 대상이 아닐 수 있습니다.', details: '국가 무료 폐렴구균 예방접종은 만 65세 이상인 분들 중, 해당 백신을 생애 처음 맞는 경우에만 1회 지원됩니다.' };
    }
  },
  education_voucher: {
    id: 'education_voucher',
    title: '평생교육바우처',
    description: '나라에서 35만원 받고 공부해보세요!',
    questions: [
      { key: 'age_voucher', text: '현재 만 19세 이상 성인이신가요?', options: ['예', '아니요'] },
      { key: 'income_level_voucher', text: '기초생활수급자, 차상위계층 또는 중위소득 65% 이하 가구에 해당하시나요?', options: ['예', '아니요', '모르겠음'] }
    ],
    getResult: (answers) => {
      if (answers.age_voucher === '예' && answers.income_level_voucher !== '아니요') {
        return { eligible: true, title: '평생교육바우처 지원', description: '평생교육바우처 지원 대상자일 가능성이 높습니다.', details: `📍 지원 내용:\n연 35만원 한도 내 평생교육기관 수강료 지원\n\n🏢 신청처:\n평생교육바우처 홈페이지 (온라인 신청)\n\n💬 Tip:\n매년 1~2월경에 신청 기간이 열리니, 미리 홈페이지를 확인하고 알림을 설정해두세요!`, link: 'https://www.lllcard.kr/main.do', linkText: '✅ 평생교육바우처 홈페이지' };
      }
      return { eligible: false, title: '평생교육바우처 지원', description: '아쉽지만 지원 대상이 아닐 수 있습니다.', details: '평생교육바우처는 만 19세 이상 성인 중 기초생활수급자, 차상위계층 및 중위소득 65% 이하 가구원을 대상으로 합니다.' };
    }
  },
  dementia_support: {
    id: 'dementia_support',
    title: '치매 치료관리비 지원',
    description: '연 36만원 치매 치료비 지원, 알고 계셨나요?',
    questions: [
      { key: 'is_dementia_registered', text: '보건소(치매안심센터)에 치매 환자로 등록되어 있으신가요?', options: ['예', '아니요'] },
      { key: 'is_receiving_treatment', text: '치매 진단을 받고 관련 약을 처방받고 계신가요?', options: ['예', '아니요'] },
      { key: 'income_level_dementia', text: '건강보험료 본인부과액 기준 중위소득 120% 이하에 해당하시나요?', options: ['예', '모르겠음', '아니요'] }
    ],
    getResult: (answers) => {
      if (answers.is_dementia_registered === '예' && answers.is_receiving_treatment === '예' && answers.income_level_dementia !== '아니요') {
        return { eligible: true, title: '치매 치료관리비 지원', description: '치매 치료관리비 지원 대상자일 가능성이 높습니다.', details: `📍 지원 내용:\n월 3만원 (연 36만원) 한도 내 약제비 및 진료비 본인부담금 실비 지원\n\n🏢 신청처:\n주소지 관할 보건소(치매안심센터)\n\n💬 Tip:\n신청 시 신분증, 처방전, 본인 통장 사본 등의 서류가 필요하니 미리 준비해가세요.`, link: 'https://www.nid.or.kr/', linkText: '✅ 중앙치매센터 홈페이지' };
      }
      return { eligible: false, title: '치매 치료관리비 지원', description: '아쉽지만 지원 대상이 아닐 수 있습니다.', details: '치매 치료비 지원은 치매안심센터에 등록된 환자 중, 소득 기준을 만족하고 실제 치료를 받는 경우에 지원됩니다.' };
    }
  },
};

export default function App() {
  const [step, setStep] = useState('intro');
  const [name, setName] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // [GA] step(화면)이 바뀔 때마다 페이지뷰를 전송하는 로직
  useEffect(() => {
    const pagePath = `/${step}${selectedFlow ? `/${selectedFlow}` : ''}`;
    ReactGA.send({ hitType: "pageview", page: pagePath, title: step });
  }, [step, selectedFlow]);

  const handleStart = () => {
    if (name.trim() === '') {
      document.getElementById('name-input-error').textContent = '이름을 입력해주세요.';
      return;
    }
    document.getElementById('name-input-error').textContent = '';
    setStep('selection');
  };

  const handleFlowSelect = (flowId) => {
    // [GA] 어떤 혜택을 선택했는지 이벤트 전송
    ReactGA.event({
      category: "Benefit Navigation",
      action: "Select Benefit",
      label: BENEFIT_FLOWS[flowId].title,
    });
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
      
      // [GA] 최종 결과(대상/비대상) 이벤트 전송
      ReactGA.event({
        category: "Benefit Result",
        action: finalResult.eligible ? "Eligible" : "Not Eligible",
        label: finalResult.title
      });

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
  
  const handleGoBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      restart();
    }
  };
    
  const ProgressIndicator = () => {
    const questions = BENEFIT_FLOWS[selectedFlow]?.questions || [];
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    return (
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6 overflow-hidden">
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
            <div className="flex justify-start mb-4">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <BackArrowIcon />
                {currentQuestionIndex > 0 ? '이전 질문으로' : '다른 혜택 선택하기'}
              </button>
            </div>

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

function ResultsScreen({ result, onRestart, name, answers }) {
  
  const renderShareSection = () => {
    const handleCopyLink = async () => {
      const shareUrl = "https://demoday-wine.vercel.app/";

      // [GA] 공유하기 버튼 클릭 이벤트
      ReactGA.event({
        category: "Engagement",
        action: "Click Share Link",
        label: result.title
      });

      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('주소가 복사되었습니다! 카톡, 문자에 붙여넣기 해보세요!');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        alert('주소 복사에 실패했어요. 다시 시도해주세요.');
      }
    };
    
    return (
        <div className="mt-8 text-center bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 text-base">이 좋은 서비스를 지인에게 알려주세요!</h4>
            <p className="text-xs text-gray-500 mt-1 mb-3">
                가족과 친구에게 공유해, 함께 혜택을 찾아보세요.
            </p>
            <button
                onClick={handleCopyLink}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all text-sm"
            >
                🔗 서비스 주소 복사하기
            </button>
        </div>
    );
  };

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
          <p className="text-xs text-left text-gray-600 mt-4 bg-green-100 p-3 rounded whitespace-pre-wrap">{result.details}</p>
          {result.link && (
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              // ▼▼▼ [GA] 외부 링크 클릭 이벤트 추적 ▼▼▼
              onClick={() => {
                ReactGA.event({
                  category: "Outbound Link",
                  action: "Click Official Site",
                  label: result.title
                });
              }}
              // ▲▲▲ [GA] 외부 링크 클릭 이벤트 추적 ▲▲▲
              className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md text-base transition-transform active:scale-[0.99]"
            >
              {result.linkText || '자세히 보기'}
            </a>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center shadow-sm">
          <div className="flex justify-center"><AlertTriangleIcon /></div>
          <h3 className="font-bold text-xl text-yellow-800 mt-3">지금은 해당되지 않아요</h3>
          <p className="text-gray-700 mt-2">{result.description}</p>
          <p className="text-xs text-left text-gray-600 mt-4 bg-yellow-100 p-3 rounded whitespace-pre-wrap">{result.details}</p>
        </div>
      )}
      
      <SubscriptionForm answers={answers} name={name} result={result} />
      
      {renderShareSection()}

      <button
        onClick={onRestart}
        className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-transform active:scale-[0.99]"
      >
        다른 혜택 알아보기
      </button>
    </div>
  );
}

function SubscriptionForm({ answers, name, result }) {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const isEligible = result.eligible; 
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!/^\d{10,11}$/.test(phone.replace(/-/g, ''))) {
        setErrorMsg('올바른 휴대폰 번호 10~11자리를 입력해주세요.');
        return;
      }
      setErrorMsg('');
      setStatus('submitting');
      
      // [GA] 가장 중요한 전환 이벤트: 알림 신청
      ReactGA.event({
        category: "Conversion",
        action: "Submit Phone Number",
        label: result.title,
        value: isEligible ? 1 : 0 // 대상자는 1, 비대상자는 0으로 값을 보내 데이터 분석에 활용
      });

      const SCRIPT_URL = import.meta.env.VITE_GAS_ENDPOINT; 
  
      const formData = {
        timestamp: new Date().toLocaleString('ko-KR'),
        name,
        phone,
        benefitTitle: result.title,
        ...answers,
      };
  
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setTimeout(() => {
            setStatus('success');
            setPhone('');
          }, 2000); 
        })
        .catch(err => {
          console.error('Error submitting form:', err);
          setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          setStatus('error');
        });
    };
  
    if (status === 'success') {
      return (
        <div className="mt-8 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center">
          <div className="flex justify-center"><CheckCircleIcon /></div>
          <p className="font-bold mt-2">신청이 완료되었습니다!</p>
          <p className="text-sm">좋은 소식이 생기면 가장 먼저 알려드릴게요.</p>
        </div>
      );
    }
  
    const content = {
        eligible: {
            title: "혜택 신청, 잊지 않게 챙겨드릴게요!😁",
            description: "신청 기간을 놓치면 내년까지 기다려야 해요. 깜빡하지 않도록 알림을 보내드릴게요."
        },
        notEligible: {
            title: "아쉬우신가요? 기회는 또 있습니다!😊",
            description: "정부 정책은 매번 바뀌어요. 대상이 되거나 새로운 맞춤 혜택이 생기면 가장 먼저 알려드릴게요."
        }
    };

    const currentContent = isEligible ? content.eligible : content.notEligible;

    return (
      <div className="mt-8 bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
        <h3 className="font-bold text-lg text-gray-900">{currentContent.title}</h3>
        <p className="text-gray-700 mt-2 mb-4 text-sm">
          {currentContent.description}
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
            className={`w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${status === 'submitting' ? 'animate-pulse' : ''}`}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? '신청하는 중...' : '무료로 알림 받기 🔔'}
          </button>
    
          {status === 'submitting' && (
            <p className="text-gray-500 text-sm mt-2">
              잠시만 기다려주세요. 좋은 소식을 놓치지 않도록 꼼꼼히 기억하는 중이에요.😁
            </p>
          )}
    
          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
          {status === 'error' && !errorMsg && <p className="text-red-500 text-sm mt-2">오류가 발생했습니다.</p>}
        </form>
      </div>
    );
  }