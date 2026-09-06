import React, { useState } from 'react';
import './App.css';

interface Member {
  id: string;
  characterName: string;
  server: string;
  className: string;
  level: number;
  guildRole: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'register'>('search');
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 등록 폼 상태
  const [formData, setFormData] = useState({
    characterName: '',
    server: '아이온1서버',
    className: '검성',
    level: 1,
    guildRole: '길드원',
  });
  const [registerStatus, setRegisterStatus] = useState('');

  // 캐릭터 검색 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 회원 등록 함수
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterStatus('등록 중...');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegisterStatus('성공적으로 등록되었습니다!');
        setFormData({
          characterName: '',
          server: '아이온1서버',
          className: '검성',
          level: 1,
          guildRole: '길드원',
        });
      } else {
        setRegisterStatus('등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      setRegisterStatus('오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>AION 2 길드원 커뮤니티</h1>
        <p>회원 등록 및 캐릭터 검색 시스템</p>
      </header>

      {/* 탭 메뉴 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: activeTab === 'search' ? '#0070f3' : '#eee',
            color: activeTab === 'search' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          캐릭터 검색
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: activeTab === 'register' ? '#0070f3' : '#eee',
            color: activeTab === 'register' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          신규 회원 등록
        </button>
      </div>

      {/* 검색 탭 */}
      {activeTab === 'search' && (
        <section>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="캐릭터명 또는 직업을 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button
              type="submit"
              disabled={isSearching}
              style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </form>

          <div>
            <h3>검색 결과</h3>
            {searchResults.length === 0 ? (
              <p style={{ color: '#666' }}>검색 결과가 없습니다.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {searchResults.map((member) => (
                  <li
                    key={member.id}
                    style={{
                      padding: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.1em' }}>{member.characterName}</strong>
                      <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.9em' }}>
                        [{member.server}] Lv.{member.level} {member.className}
                      </span>
                    </div>
                    <span style={{ padding: '4px 8px', backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: '4px', fontSize: '0.85em' }}>
                      {member.guildRole}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* 등록 탭 */}
      {activeTab === 'register' && (
        <section>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>캐릭터명:</label>
              <input
                type="text"
                required
                value={formData.characterName}
                onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>서버:</label>
                <select
                  value={formData.server}
                  onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="아이온1서버">아이온1서버</option>
                  <option value="아이온2서버">아이온2서버</option>
                  <option value="아이온3서버">아이온3서버</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>직업:</label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="검성">검성</option>
                  <option value="수호성">수호성</option>
                  <option value="궁성">궁성</option>
                  <option value="살성">살성</option>
                  <option value="마도성">마도성</option>
                  <option value="정령성">정령성</option>
                  <option value="치유성">치유성</option>
                  <option value="호법성">호법성</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>레벨:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>길드 직책:</label>
                <select
                  value={formData.guildRole}
                  onChange={(e) => setFormData({ ...formData, guildRole: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="길드장">길드장</option>
                  <option value="부길드장">부길드장</option>
                  <option value="간부">간부</option>
                  <option value="길드원">길드원</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px',
              }}
            >
              등록하기
            </button>
          </form>

          {registerStatus && (
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{registerStatus}</p>
          )}
        </section>
      )}
    </div>
  );
}
