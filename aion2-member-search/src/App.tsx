import React, { useState } from 'react';

interface CharacterInfo {
  nickname: string;
  classType: string;
  level: number;
  server: string;
  race: string;
  legion: string;
  power: string;
  itemLevel: string;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const SERVERS = [
  '지켈', '시엘', '이스라펠', '이슈타르', '루미엘', '트리니엘', '타르구탄', 
  '카이시넬', '에레슈키갈', '바바라', '바카르마', '아스팔겔', '네몬', '바이젤', 
  '아리엘', '루드라', '아스펠', '유스티엘', '네자칸', '프레기온', '나니아', 
  '무닌', '브리트라', '크라통', '랜카카', '베스파다에다', '플로론', '파프니르', 
  '오다르', '앤드나호', '타하바타', '포에타', '하달', '랜가통', '페르노스', 
  '티아마트', '다미누', '카사카', '크로메데', '히다니에', '콰이링', '루더스'
];

const CLASSES = ['수호성', '검성', '궁성', '살성', '마도성', '정령성', '치유성', '호법성'];

export default function App() {
  const [selectedServer, setSelectedServer] = useState('지켈');
  const [selectedClass, setSelectedClass] = useState('궁성');
  const [searchName, setSearchName] = useState('');

  const [character, setCharacter] = useState<CharacterInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert('캐릭터 닉네임을 입력해 주세요.');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setCharacter(null);

    try {
      const response = await fetch(`/api/search?server=${encodeURIComponent(selectedServer)}&name=${encodeURIComponent(searchName)}`);
      
      if (!response.ok) {
        throw new Error('캐릭터 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      setCharacter({
        nickname: data.nickname || searchName,
        classType: data.classType || selectedClass,
        level: data.level || 60,
        server: data.server || selectedServer,
        race: data.race || '천족',
        legion: data.legion || '레기온 미가입',
        power: data.power || '0',
        itemLevel: data.itemLevel || '0'
      });
    } catch (error: any) {
      setErrorMessage(error.message || '검색 도중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleCell = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const newSelected = new Set(selectedCells);
    if (newSelected.has(key)) newSelected.delete(key);
    else newSelected.add(key);
    setSelectedCells(newSelected);
  };

  const toggleDayAll = (day: string) => {
    const newSelected = new Set(selectedCells);
    const dayHours = Array.from({ length: 24 }, (_, i) => i);
    const allSelected = dayHours.every(h => newSelected.has(`${day}-${h}`));

    dayHours.forEach(h => {
      if (allSelected) newSelected.delete(`${day}-${h}`);
      else newSelected.add(`${day}-${h}`);
    });
    setSelectedCells(newSelected);
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#f1f5f9', minHeight: '100vh', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '4px' }}>| Register</div>
        <h1 style={{ fontSize: '26px', margin: '0 0 8px 0', color: '#ffffff' }}>멤버등록</h1>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px 0' }}>
          서버와 직업을 선택한 후 닉네임을 검색해 멤버 등록을 진행하세요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              style={{ flex: 1, padding: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            >
              {SERVERS.map(s => <option key={s} value={s}>{s} 서버</option>)}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ flex: 1, padding: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="캐릭터 닉네임 입력"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div style={{ padding: '12px', backgroundColor: '#451a1a', border: '1px solid #7f1d1d', borderRadius: '8px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {character && (
          <div style={{ backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #334155' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{character.nickname}</span>
                  <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 'bold' }}>{character.classType}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Lv.{character.level}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {character.server} | {character.race} | <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{character.legion}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>전투력</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{character.power}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>아이템레벨</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{character.itemLevel}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '4px' }}>| 주 접속시간</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            시간 혹은 요일을 누르면 해당 행/열이 전체 선택됩니다.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(7, 1fr)', gap: '2px', backgroundColor: '#1e293b', padding: '1px', borderRadius: '6px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '8px 0', textAlign: 'center', fontSize: '12px', color: '#64748b' }}></div>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDayAll(day)}
                style={{ backgroundColor: '#0f172a', color: day === '토' ? '#38bdf8' : day === '일' ? '#f87171' : '#cbd5e1', border: 'none', padding: '8px 0', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {day}
              </button>
            ))}

            {Array.from({ length: 24 }, (_, hour) => (
              <React.Fragment key={hour}>
                <div style={{ backgroundColor: '#0f172a', fontSize: '10px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {hour % 2 === 0 ? String(hour).padStart(2, '0') : ''}
                </div>

                {DAYS.map((day) => {
                  const cellKey = `${day}-${hour}`;
                  const isSelected = selectedCells.has(cellKey);
                  return (
                    <div
                      key={cellKey}
                      onClick={() => toggleCell(day, hour)}
                      style={{
                        height: '14px',
                        backgroundColor: isSelected ? '#2563eb' : '#0b1329',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s'
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}