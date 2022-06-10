import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

export default function setUserData(emailIsExist) {
  const userStore = useUserStore()
  if (!emailIsExist) {
    ElMessageBox.prompt(
      'You did not set your email! Please input your e-mail.',
      `Hello ${userStore.$state.username}!`,
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Invalid Email'
      }
    )
      .then(({ value }) => {
        userStore
          .setEmail(value)
          .then((email) => {
            ElMessage({
              type: 'success',
              message: `Your email is:${email}`
            })
          })
          .catch((e) => {
            console.log(e)
            ElMessage({
              type: 'warning',
              message: 'Set email occured error!'
            })
          })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled'
        })
      })
  }
  console.log('setUserData', emailIsExist)
}
