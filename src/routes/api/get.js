module.exports = (req, res) => {
  console.log('SERVER HIT: GET /v1/fragments', 'user:', req.user);
  res.status(200).json({ status: 'ok', fragments: [] });
};
