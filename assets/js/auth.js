/**
 * Simple Client-side Authentication & Session Management
 */
const AuthSystem = {
  USERS: [
    { username: 'chi', password: 'chi', displayName: 'Chị Chi', role: 'approver', title: 'Quản lý nghiệm thu' },
    { username: 'drv', password: 'drv', displayName: 'Kỹ thuật DRV', role: 'tester', title: 'Kỹ thuật viên / Kiểm thử' }
  ],

  STORAGE_KEY: 'drv_tasks_current_user',

  getCurrentUser() {
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY) || localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  login(username, password, remember = true) {
    const cleanU = (username || '').trim().toLowerCase();
    const cleanP = (password || '').trim();
    const found = this.USERS.find(u => u.username.toLowerCase() === cleanU && u.password === cleanP);
    if (!found) return null;

    const sessionData = {
      username: found.username,
      displayName: found.displayName,
      role: found.role,
      title: found.title,
      loggedInAt: new Date().toISOString()
    };

    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    if (remember) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    }
    return sessionData;
  },

  logout() {
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};
