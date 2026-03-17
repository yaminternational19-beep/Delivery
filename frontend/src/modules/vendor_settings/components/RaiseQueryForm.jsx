import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

const RaiseQueryForm = ({ onAddQuery }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'Low',
    receiver: 'Admin'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;

    setLoading(true);

    // Simulate small delay for better UX
    setTimeout(() => {
      const newQuery = {
        id: Date.now(),
        ...formData,
        status: 'Pending',
        admin_reply: null,
        created_at: new Date().toISOString()
      };

      onAddQuery(newQuery);
      setFormData({
        subject: '',
        message: '',
        priority: 'Low',
        receiver: 'Admin'
      });
      setLoading(false);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="query-form-card" style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Raise a Query</h3>
        <p style={styles.subtitle}>Have an issue? We're here to help.</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's the issue?"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Receiver</label>
            <select
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              style={styles.select}
              disabled
            >
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your query in detail..."
            rows="5"
            style={styles.textarea}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={loading ? { ...styles.button, opacity: 0.7, cursor: 'not-allowed' } : styles.button}
        >
          {loading ? (
            'Submitting...'
          ) : (
            <>
              Submit Query <Send size={18} style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-card, #fff)',
    borderRadius: 'var(--border-radius-lg, 12px)',
    boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
    padding: 'var(--spacing-lg, 24px)',
    border: '1px solid var(--border-color, #e2e8f0)',
    height: '100%'
  },
  header: {
    marginBottom: 'var(--spacing-lg, 24px)'
  },
  title: {
    fontSize: 'var(--font-size-xl, 1.25rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--text-primary, #1e293b)',
    margin: 0
  },
  subtitle: {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--text-secondary, #64748b)',
    marginTop: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md, 16px)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm, 8px)'
  },
  row: {
    display: 'flex',
    gap: 'var(--spacing-md, 16px)'
  },
  label: {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: 'var(--text-primary, #1e293b)'
  },
  input: {
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: '1px solid var(--border-color, #cbd5e1)',
    fontSize: 'var(--font-size-sm, 0.875rem)',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: '#fff'
  },
  select: {
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: '1px solid var(--border-color, #cbd5e1)',
    fontSize: 'var(--font-size-sm, 0.875rem)',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: '1px solid var(--border-color, #cbd5e1)',
    fontSize: 'var(--font-size-sm, 0.875rem)',
    outline: 'none',
    resize: 'none',
    backgroundColor: '#fff'
  },
  button: {
    marginTop: '8px',
    padding: '12px 24px',
    backgroundColor: 'var(--primary, #6366f1)',
    color: '#fff',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: 'none',
    fontSize: 'var(--font-size-base, 1rem)',
    fontWeight: 'var(--font-weight-semibold, 600)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
  }
};

export default RaiseQueryForm;
