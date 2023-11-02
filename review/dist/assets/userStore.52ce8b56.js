import{J as p,K as l,L as m,N as f,R as U,j as i,b as d,W as g}from"./index.611fe570.js";import{P as h,a as w}from"./permissionGroupStore.a1288023.js";class v extends m{constructor(e){const r=`${f().ClientSide.WorkforceManagement}/v1/users`;super(e,r)}async getUsers(e,r){let o=[],t={};e!=null&&(t.excludePermissionGroupId=e),r!=null&&(t.excludeAdminGroup=r);try{const s=await this.axiosInstance.get("",{params:t});if(s?.data&&Array.isArray(s.data)&&s.status===200)s.data.length>0&&(o=s.data.map(n=>new h(n)));else throw new Error("Failed to parse user list");return o}catch(s){return console.error("An unexpected error occurred attempting to retrieve the Users list.",s),Promise.reject(s)}}}const c=new v([p,l]),L=U("users",()=>{const a=i(new Array),e=i(),r=i(new w),o=d(()=>a.value);async function t(){a.value=await c.getUsers()}async function s(n){const u=g("$providePermissions").value.WHQ_247_3115;e.value=await c.getUsers(n,!u)}return{userList:a,getUsers:o,usersNotPartOfPermissionGroup:e,permissionGroupWithUpdatedUsers:r,fetchUserList:t,fetchUsersNotPartOfPermissionGroup:s}});export{L as u};