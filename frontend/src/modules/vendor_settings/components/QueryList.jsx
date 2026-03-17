import React from 'react';
import { Clock, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';

const QueryList = ({ queries }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved':
        return { backgroundColor: 'var(--success-bg, #ecfdf5)', color: 'var(--success, #10b981)', icon: <CheckCircle size={14} /> };
      case 'Pending':
        return { backgroundColor: 'var(--warning-bg, #fffbeb)', color: 'var(--warning, #f59e0b)', icon: <Clock size={14} /> };
      default:
        return { backgroundColor: 'var(--info-bg, #eff6ff)', color: 'var(--info, #3b82f6)', icon: <MessageSquare size={14} /> };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { color: 'var(--danger, #ef4444)', icon: <AlertTriangle size={12} /> };
      case 'Medium':
        return { color: 'var(--warning, #f59e0b)', icon: <AlertTriangle size={12} /> };
      default:
        return { color: 'var(--info, #3b82f6)', icon: <AlertTriangle size={12} /> };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Query History</h3>
      <div style={styles.list}>
        {queries.length === 0 ? (
          <div style={styles.empty}>No queries found.</div>
        ) : (
          [...queries].reverse().map((query) => {
            const statusStyle = getStatusStyle(query.status);
            const priorityStyle = getPriorityStyle(query.priority);
            
            return (
              <div key={query.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.subjectRow}>
                    <span style={styles.subject}>{query.subject}</span>
                    <span style={{ ...styles.badge, ...statusStyle }}>
                      {statusStyle.icon}
                      {query.status}
                    </span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={{ ...styles.priority, color: priorityStyle.color }}>
                      {priorityStyle.icon} {query.priority} Priority
                    </span>
                    <span style={styles.date}>{formatDate(query.created_at)}</span>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <p style={styles.message}>{query.message}</p>
                  
                  {query.admin_reply && (
                    <div style={styles.replyBox}>
                      <div style={styles.replyHeader}>
                        <MessageSquare size={14} style={{ marginRight: '6px' }} />
                        Admin Reply
                      </div>
                      <p style={styles.replyText}>{query.admin_reply}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 'var(--font-size-xl, 1.25rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--text-primary, #1e293b)',
    marginBottom: 'var(--spacing-lg, 24px)'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md, 16px)',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  empty: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-secondary, #64748b)',
    backgroundColor: 'var(--bg-card, #fff)',
    borderRadius: '12px',
    border: '1px dashed var(--border-color, #e2e8f0)'
  },
  card: {
    backgroundColor: 'var(--bg-card, #fff)',
    borderRadius: 'var(--border-radius-md, 10px)',
    border: '1px solid var(--border-color, #e2e8f0)',
    padding: 'var(--spacing-md, 16px)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))'
  },
  cardHeader: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  subjectRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px',
    gap: '8px'
  },
  subject: {
    fontWeight: 'var(--font-weight-semibold, 600)',
    fontSize: 'var(--font-size-base, 1rem)',
    color: 'var(--text-primary, #1e293b)'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--font-size-xs, 0.75rem)'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '0.7rem',
    fontWeight: 'var(--font-weight-bold, 700)',
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  priority: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 'var(--font-weight-medium, 500)'
  },
  date: {
    color: 'var(--text-light, #94a3b8)'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  message: {
    margin: 0,
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--text-secondary, #475569)',
    lineHeight: '1.5'
  },
  replyBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--border-radius-sm, 6px)',
    padding: '12px',
    borderLeft: '4px solid var(--primary, #6366f1)'
  },
  replyHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font-size-xs, 0.75rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--primary, #6366f1)',
    marginBottom: '4px',
    textTransform: 'uppercase'
  },
  replyText: {
    margin: 0,
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--text-primary, #1e293b)',
    lineHeight: '1.4'
  }
};

export default QueryList;
