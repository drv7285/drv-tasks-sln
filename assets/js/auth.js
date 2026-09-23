/**
 * Simple Client-side Authentication & Session Management
 * Hỗ trợ tự động đăng nhập nhanh qua URL parameter (?u=chi hoặc ?user=chi).
 * Khi truyền qua URL hoặc nhập pass giống username, hệ thống coi username == password và cấp quyền ngay.
 */
const AuthSystem = {
  USERS: [
    { username: 'chi', password: 'chi', displayName: 'Chị Chi', role: 'approver', title: 'Quản lý nghiệm thu' },
    { username: 'qtu', password: 'qtu', displayName: 'Qtu', role: 'approver', title: 'Người nghiệm thu' },
    { username: 'drv', password: 'drv', displayName: 'Kỹ thuật DRV', role: 'tester', title: 'Kỹ thuật viên / Kiểm thử' }
  ],

  STORAGE_KEY: 'drv_tasks_current_user',

  /**
   * Tự động kiểm tra URL query parameters: ?u=chi hoặc ?user=chi
   * Nếu có trên URL, hệ thống coi username và pwd giống nhau và tự động cấp phiên đăng nhập.
   */
  checkUrlAuth() {
    try {
      if (typeof window === 'undefined' || !window.location) return null;
      const params = new URLSearchParams(window.location.search);
      const u = params.get('u') || params.get('user');
      if (u) {
        const p = params.get('p') || params.get('pwd') || params.get('pass') || u;
        return this.login(u, p, true);
      }
    } catch (e) {
      console.warn('Url auth error:', e);
    }
    return null;
  },

  getCurrentUser() {
    // 1. Kiểm tra nếu có param ?u=... trên URL thì ưu tiên đăng nhập trực tiếp
    const urlUser = this.checkUrlAuth();
    if (urlUser) return urlUser;

    // 2. Kiểm tra phiên đã lưu trong sessionStorage hoặc localStorage
    try {
      if (typeof window === 'undefined') return null;
      const data = sessionStorage.getItem(this.STORAGE_KEY) || localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  login(username, password, remember = true) {
    const cleanU = (username || '').trim().toLowerCase();
    const cleanP = (password || '').trim();
    if (!cleanU) return null;

    // 1. Tìm trong danh sách tài khoản định sẵn
    let found = this.USERS.find(u => u.username.toLowerCase() === cleanU && u.password === cleanP);

    // 2. Nếu username == password, cho phép đăng nhập tự động
    if (!found && cleanU === cleanP.toLowerCase()) {
      found = {
        username: cleanU,
        password: cleanP,
        displayName: cleanU.charAt(0).toUpperCase() + cleanU.slice(1),
        role: 'approver',
        title: 'Người nghiệm thu'
      };
    }

    if (!found) return null;

    const sessionData = {
      username: found.username,
      displayName: found.displayName,
      role: found.role,
      title: found.title,
      loggedInAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      if (remember) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      }
    } catch {}

    return sessionData;
  },

  logout() {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthSystem;
}
