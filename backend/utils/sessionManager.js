/**
 * Session Manager
 * Manages in-memory session storage and validation
 * Uses HashMap for O(1) lookup efficiency
 */
class SessionManager {
  constructor() {
    // HashMap to store active sessions: userId -> Set of tokens
    this.sessions = new Map();
    
    // Session expiry time (24 hours)
    this.SESSION_DURATION = 24 * 60 * 60 * 1000;
  }
  
  /**
   * Create a new session for user
   * @param {string} userId - User ID
   * @param {string} token - JWT token
   */
  createSession(userId, token) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new Map());
    }
    
    this.sessions.get(userId).set(token, {
      createdAt: Date.now(),
      lastAccess: Date.now()
    });
  }
  
  /**
   * Validate if session exists and is not expired
   * @param {string} userId - User ID
   * @param {string} token - JWT token
   * @returns {boolean} - Session validity
   */
  validateSession(userId, token) {
    if (!this.sessions.has(userId)) {
      return false;
    }
    
    const userSessions = this.sessions.get(userId);
    const session = userSessions.get(token);
    
    if (!session) {
      return false;
    }
    
    // Check if session has expired
    const isExpired = Date.now() - session.createdAt > this.SESSION_DURATION;
    
    if (isExpired) {
      userSessions.delete(token);
      return false;
    }
    
    // Update last access time
    session.lastAccess = Date.now();
    return true;
  }
  
  /**
   * Remove session (logout)
   * @param {string} userId - User ID
   * @param {string} token - JWT token
   */
  removeSession(userId, token) {
    if (this.sessions.has(userId)) {
      this.sessions.get(userId).delete(token);
    }
  }
  
  /**
   * Remove all sessions for a user
   * @param {string} userId - User ID
   */
  removeAllUserSessions(userId) {
    this.sessions.delete(userId);
  }
  
  /**
   * Cleanup expired sessions (run periodically)
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    
    for (const [userId, userSessions] of this.sessions.entries()) {
      for (const [token, session] of userSessions.entries()) {
        if (now - session.createdAt > this.SESSION_DURATION) {
          userSessions.delete(token);
        }
      }
      
      // Remove user entry if no active sessions
      if (userSessions.size === 0) {
        this.sessions.delete(userId);
      }
    }
  }
}

// Singleton instance
const sessionManager = new SessionManager();

// Cleanup expired sessions every hour
setInterval(() => {
  sessionManager.cleanupExpiredSessions();
}, 60 * 60 * 1000);

module.exports = sessionManager;
