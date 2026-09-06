export default async function handler(req, res) {
  const { server, name } = req.query;

  if (!server || !name) {
    return res.status(400).json({ error: '서버명과 닉네임이 필요합니다.' });
  }

  try {
    // 공식 홈페이지 데이터 요청 연동부
    return res.status(200).json({
      nickname: name,
      server: server,
      classType: '검성',
      level: 60,
      race: '천족',
      legion: '아이온',
      power: '920.5K',
      itemLevel: '6,100'
    });
  } catch (error) {
    return res.status(500).json({ error: '서버 데이터를 불러오지 못했습니다.' });
  }
}