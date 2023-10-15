import {getHostName, getHttpBody, getHttpMethod} from '../utils/api.utils';
import { basePath } from '../utils/helpers.utils';
const userSessionObj: any = localStorage.getItem('user') || localStorage.getItem('adminUser');
const user = userSessionObj ? JSON.parse(userSessionObj) : '';
const adminSessionObj: any = localStorage.getItem('adminUser');
const adminUser = adminSessionObj ? JSON.parse(adminSessionObj):'';

const handleLogoutResponse = (user: any) => {
  localStorage.removeItem('appContext'); 
  localStorage.removeItem("uui_activeView_table")
  localStorage.removeItem("uui_ca_workflow")
  localStorage.removeItem("uui_contacts_group")
  localStorage.removeItem('user');
  localStorage.removeItem('userView');
  localStorage.removeItem('silentDeleteConfirm');
  if (adminUser?.admin) {
    window.location.href = `${basePath}/adminEntry/`;
  } else {
    localStorage.removeItem('defaultVirtualNo');
    window.location.href = `${basePath}/auth/`;
  }
};
export async function userLogout() {
  const payload = {
    tokenId: user?.tokenId || ''
  };
  await fetch(`${getHostName()}/logout`, {
    headers: {
      'content-type': 'application/json'
    },
    body: getHttpBody(JSON.stringify(payload)),
    method: getHttpMethod()
  })
    .then(handleLogoutResponse)
    .catch(handleLogoutResponse);
}
