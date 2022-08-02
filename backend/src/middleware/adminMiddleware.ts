import { User } from "../entities/User"

export async function isAdminMiddleware  (req: any, res: any, next:any) {
  try {
    const { email } = req.body
    const user = await User.findOneBy({ email: email })
      if (user != null) {
        if(user.is_admin === true){
          res.send({
            status: 'success',
            msg: 'admin access granted',
          })
        }else{
          res.send({
            status: 'failed',
            msg: 'user is not admin',
          })
        }
      }else{
        res.send({
          status: 'failed',
          msg: 'user not found',
        })
      }
      
    }
    catch(error){
      res.send({
        status: 'failed',
        msg: 'unable to grant admin access',
      })
      console.log('🔴 Something went wrong during admin access🤔', error)
    }
  }