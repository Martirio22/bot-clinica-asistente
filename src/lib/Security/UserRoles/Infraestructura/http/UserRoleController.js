class UserRoleController {
  constructor({ asignar, listar, listarRolesPorUser, remover }) { this.asignarUseCase=asignar; this.listarUseCase=listar; this.listarRolesPorUserUseCase=listarRolesPorUser; this.removerUseCase=remover; }
  asignar = async (req,res) => { const data = await this.asignarUseCase.ejecutar(req.body); res.status(201).json({success:true,data}); };
  listar = async (req,res) => { const data = await this.listarUseCase.ejecutar(); res.json({success:true,data}); };
  listarRolesPorUser = async (req,res) => { const data = await this.listarRolesPorUserUseCase.ejecutar(req.params.userId); res.json({success:true,data}); };
  remover = async (req,res) => { await this.removerUseCase.ejecutar(req.params.userId, req.params.roleId); res.json({success:true,message:"Rol removido del usuario"}); };
}
module.exports = UserRoleController;
