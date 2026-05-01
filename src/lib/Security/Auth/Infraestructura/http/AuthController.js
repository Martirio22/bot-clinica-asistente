class AuthController {
  constructor({ registerUser, loginUser, refreshToken, logoutUser, obtenerSecurityUserPorId }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.refreshToken = refreshToken;
    this.logoutUser = logoutUser;
    this.obtenerSecurityUserPorId = obtenerSecurityUserPorId;
  }
  register = async (req, res) => { const user = await this.registerUser.ejecutar(req.body); res.status(201).json({ success:true, data:user }); };
  login = async (req, res) => { const result = await this.loginUser.ejecutar({ ...req.body, ipAddress:req.ip, userAgent:req.headers["user-agent"] }); res.json({ success:true, data:result }); };
  refresh = async (req, res) => { const result = await this.refreshToken.ejecutar({ refreshToken:req.body.refreshToken, ipAddress:req.ip, userAgent:req.headers["user-agent"] }); res.json({ success:true, data:result }); };
  logout = async (req, res) => { await this.logoutUser.ejecutar({ refreshToken:req.body.refreshToken, userId:req.user?.sub }); res.json({ success:true, message:"Sesión cerrada" }); };
  me = async (req, res) => { const user = await this.obtenerSecurityUserPorId.ejecutar(req.user.sub); res.json({ success:true, data:user }); };
}
module.exports = AuthController;
