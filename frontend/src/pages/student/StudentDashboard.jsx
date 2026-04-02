import { useState, useEffect } from 'react';
import {
  DUMMY_GROUP,
  DUMMY_MILESTONES,
  DUMMY_TEAM_PROGRESS,
  DUMMY_CURRENT_TERM,
  DUMMY_MILESTONE_PROGRESS,
  DUMMY_MILESTONE_DUE_DATES,
} from '../../utils/constants';
import * as projectsApi from '../../api/projects';
import * as milestonesApi from '../../api/milestones';

export default function StudentDashboard() {
  // Initialize ALL state with dummy data so content always shows
  const [group, setGroup] = useState(DUMMY_GROUP);
  const [milestones, setMilestones] = useState(DUMMY_MILESTONES);
  const [teamProgress, setTeamProgress] = useState(DUMMY_TEAM_PROGRESS);
  const [currentTerm, setCurrentTerm] = useState(DUMMY_CURRENT_TERM);
  const [milestoneProgress, setMilestoneProgress] = useState(DUMMY_MILESTONE_PROGRESS);
  const [milestoneDueDates, setMilestoneDueDates] = useState(DUMMY_MILESTONE_DUE_DATES);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026

  useEffect(() => {
    (async () => {
      try {
        const [gRes, mRes] = await Promise.all([projectsApi.getMyGroup(), milestonesApi.getForStudent()]);
        const g = gRes?.data ?? DUMMY_GROUP;
        const m = Array.isArray(mRes?.data) && mRes.data.length > 0 ? mRes.data : DUMMY_MILESTONES;
        setGroup(g);
        setMilestones(m);
      } catch (_) {
        setGroup(DUMMY_GROUP);
        setMilestones(DUMMY_MILESTONES);
      }
    })();
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Check if a day has a milestone due
  const getMilestoneForDay = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (milestoneDueDates || []).find(m => m.date === dateStr);
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  const todo = teamProgress?.todo ?? 8;
  const inProgress = teamProgress?.inProgress ?? 3;
  const done = teamProgress?.done ?? 1;
  const total = teamProgress?.total ?? 12;
  const year = currentTerm?.year ?? '2024';
  const phase = currentTerm?.activePhase ?? 'Proposal';
  const totalM = milestoneProgress?.totalMilestones ?? 7;
  const submittedM = milestoneProgress?.submittedMilestones ?? 1;

  const dueList = milestoneDueDates && milestoneDueDates.length > 0 ? milestoneDueDates : DUMMY_MILESTONE_DUE_DATES;

  const subtitleText = `${group?.name || 'Your team'} · ${currentTerm?.year || '2024'} ${currentTerm?.activePhase || 'Proposal'}`;

  return (
    <div className="space-y-6 min-h-full">
      {/* Hero header */}
      <div className="dashboard-hero px-6 py-6 sm:px-8 sm:py-7 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #1F2E5A 0%, #2D3E6A 50%, #1F2E5A 100%)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-[#F4B400] text-sm sm:text-base font-medium">{subtitleText}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {year}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <div className="dashboard-stat-card rounded-2xl bg-white/90 backdrop-blur p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2D3E6A] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#1F2E5A]">Current term</p>
              <p className="text-xl font-bold text-[#1F2E5A]">{year}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-stat-card rounded-2xl bg-white/90 backdrop-blur p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F4B400] to-[#DAA520] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#1F2E5A]">Active phase</p>
              <p className="text-xl font-bold text-[#1F2E5A]">{phase}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-stat-card rounded-2xl bg-white/90 backdrop-blur p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2D3E6A] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#1F2E5A]">Tasks</p>
              <p className="text-xl font-bold text-[#1F2E5A]">{total} <span className="text-sm font-normal text-[#1F2E5A]">total</span></p>
            </div>
          </div>
        </div>
        <div className="dashboard-stat-card rounded-2xl bg-white/90 backdrop-blur p-5 shadow-sm hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#1F2E5A]">Milestones</p>
              <p className="text-xl font-bold text-[#1F2E5A]">{submittedM}<span className="text-[#1F2E5A]">/</span>{totalM}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team progress */}
        <div className="dashboard-section-card dashboard-card-accent rounded-2xl bg-white border border-[#1F2E5A]/80 shadow-sm p-6 pt-7 flex flex-col animate-fade-in-up overflow-hidden" style={{ animationDelay: '80ms' }}>
          <h3 className="dashboard-section-header text-sm font-semibold text-[#1F2E5A] uppercase tracking-wider mb-6">Team progress</h3>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex flex-col items-center flex-1 max-w-[100px] rounded-xl bg-[#1F2E5A]/10 py-4 px-3 border border-[#1F2E5A]/20 hover:border-[#1F2E5A]/40 transition-colors">
              <span className="text-2xl font-bold text-[#1F2E5A]">{todo}</span>
              <span className="text-xs font-medium text-[#1F2E5A]/80 mt-0.5">To do</span>
            </div>
            <div className="flex flex-col items-center flex-1 max-w-[100px] rounded-xl bg-[#F4B400]/10 py-4 px-3 border border-[#F4B400]/20 hover:border-[#F4B400]/40 transition-colors">
              <span className="text-2xl font-bold text-[#F4B400]">{inProgress}</span>
              <span className="text-xs font-medium text-[#F4B400]/80 mt-0.5">In progress</span>
            </div>
            <div className="flex flex-col items-center flex-1 max-w-[100px] rounded-xl bg-emerald-50/80 py-4 px-3 border border-emerald-100/80 hover:border-emerald-200/80 transition-colors">
              <span className="text-2xl font-bold text-emerald-700">{done}</span>
              <span className="text-xs font-medium text-emerald-600/80 mt-0.5">Done</span>
            </div>
          </div>
          <div className="flex justify-center flex-1">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(241 245 249)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(100 116 139)" strokeWidth="10" strokeDasharray={`${total ? (todo / total) * 264 : 176} 264`} strokeDashoffset="0" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(245 158 11)" strokeWidth="10" strokeDasharray={`${total ? (inProgress / total) * 264 : 66} 264`} strokeDashoffset={total ? `${-(todo / total) * 264}` : '0'} />
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(16 185 129)" strokeWidth="10" strokeDasharray={`${total ? (done / total) * 264 : 22} 264`} strokeDashoffset={total ? `${-((todo + inProgress) / total) * 264}` : '0'} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500">Total</span>
                <span className="text-2xl font-bold text-slate-800">{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone progress */}
        <div className="dashboard-section-card dashboard-card-accent rounded-2xl bg-white border border-[#1F2E5A]/80 shadow-sm p-6 pt-7 flex flex-col animate-fade-in-up overflow-hidden" style={{ animationDelay: '160ms' }}>
          <h3 className="dashboard-section-header text-sm font-semibold text-[#1F2E5A] uppercase tracking-wider mb-6">Milestone progress</h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#1F2E5A]/80">Submitted</span>
                <span className="font-semibold text-[#1F2E5A]">{submittedM} of {totalM}</span>
              </div>
              <div className="h-3 bg-[#1F2E5A]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#F4B400] rounded-full dashboard-progress-fill" style={{ width: `${totalM ? (submittedM / totalM) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="pt-4 border-t border-[#1F2E5A]/20 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#F4B400]" />
                <span className="text-[#1F2E5A]/80">Submitted milestones</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#1F2E5A]/40" />
                <span className="text-[#1F2E5A]/80">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="dashboard-section-card dashboard-card-accent rounded-2xl bg-white border border-[#1F2E5A]/80 shadow-sm p-6 pt-7 flex flex-col animate-fade-in-up overflow-hidden" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="dashboard-section-header text-sm font-semibold text-[#1F2E5A] uppercase tracking-wider">Due dates</h3>
            <div className="flex items-center gap-1">
              <button type="button" onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#1F2E5A]/10 hover:text-[#1F2E5A] text-[#1F2E5A] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-sm font-semibold text-[#1F2E5A] min-w-[120px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button type="button" onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#1F2E5A]/10 hover:text-[#1F2E5A] text-[#1F2E5A] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#1F2E5A]/70">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm flex-1 content-start mt-1">
            {Array.from({ length: startingDay }).map((_, i) => <div key={`e-${i}`} className="py-2" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const milestone = getMilestoneForDay(day);
              const isSun = (startingDay + i) % 7 === 6;
              const isSat = (startingDay + i) % 7 === 5;
              const isDue = !!milestone && !isToday(day);
              const isJune1 = day === 1 && currentMonth.getMonth() === 5 && currentMonth.getFullYear() === 2024;
              const underlinedDue = isDue && (day === 1 || day === 13 || day === 18);
              return (
                <div
                  key={day}
                  className={`py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isToday(day) ? 'bg-[#1F2E5A] text-white' : ''}
                    ${isJune1 ? 'bg-[#F4B400]/20 text-[#1F2E5A] hover:bg-[#F4B400]/30' : ''}
                    ${isDue && !isJune1 ? 'bg-[#F4B400]/10 text-[#1F2E5A] hover:bg-[#F4B400]/20' : ''}
                    ${underlinedDue && !isJune1 ? 'ring-1 ring-[#F4B400]/40' : ''}
                    ${!milestone && !isToday(day) ? (isSun || isSat ? 'text-[#1F2E5A]/40 hover:bg-[#1F2E5A]/10' : 'text-[#1F2E5A] hover:bg-[#1F2E5A]/10') : ''}
                  `}
                  title={milestone?.title || ''}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-section-card dashboard-card-accent rounded-2xl bg-white border border-[#1F2E5A]/80 shadow-sm p-6 pt-7 animate-fade-in-up overflow-hidden" style={{ animationDelay: '320ms' }}>
          <h3 className="dashboard-section-header text-sm font-semibold text-[#1F2E5A] uppercase tracking-wider mb-4">Upcoming deadlines</h3>
          <div className="space-y-2">
            {dueList.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-[#1F2E5A]/5 hover:bg-[#1F2E5A]/10 hover:shadow-sm border border-[#1F2E5A]/20 transition-all duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m.status === 'completed' ? 'bg-emerald-500' : 'bg-[#F4B400]'}`} />
                  <span className="text-[#1F2E5A] font-medium text-sm truncate">{m.title}</span>
                </div>
                <span className="text-xs text-[#1F2E5A]/80 flex-shrink-0 ml-2">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section-card dashboard-card-accent rounded-2xl bg-white border border-[#1F2E5A]/80 shadow-sm p-6 pt-7 animate-fade-in-up overflow-hidden" style={{ animationDelay: '400ms' }}>
          <h3 className="dashboard-section-header text-sm font-semibold text-[#1F2E5A] uppercase tracking-wider mb-4">Team</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#1F2E5A]/5 border border-[#1F2E5A]/20">
                <p className="text-xs text-[#1F2E5A]/80 mb-0.5">Group</p>
                <p className="font-semibold text-[#1F2E5A] text-sm truncate" title={group?.name}>{group?.name || '—'}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#1F2E5A]/5 border border-[#1F2E5A]/20">
                <p className="text-xs text-[#1F2E5A]/80 mb-0.5">Supervisor</p>
                <p className="font-semibold text-[#1F2E5A] text-sm truncate" title={group?.supervisor?.name}>{group?.supervisor?.name || '—'}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#1F2E5A]/5 border border-[#1F2E5A]/20">
              <p className="text-xs text-[#1F2E5A]/80 mb-1">Project</p>
              <p className="font-semibold text-[#1F2E5A] text-sm truncate" title={group?.project?.title}>{group?.project?.title || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#1F2E5A]/80 mb-2">Members</p>
              <div className="flex flex-wrap gap-2">
                {(group?.members ?? []).map((member) => (
                  <div key={member.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F2E5A]/5 border border-[#1F2E5A]/20 hover:border-[#F4B400]/40 hover:bg-[#F4B400]/10 transition-all duration-200">
                    <div className="w-8 h-8 rounded-full bg-[#1F2E5A]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-[#1F2E5A]">{member.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1F2E5A] truncate max-w-[100px]">{member.name}</p>
                      <p className="text-xs text-[#1F2E5A]/80 truncate max-w-[100px]">{member.rollNumber || member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
