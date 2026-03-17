import React, { useState } from 'react';
import RaiseQueryForm from './components/RaiseQueryForm';
import QueryList from './components/QueryList';
import FAQSection from './components/FAQSection';
import { mockQueries, faqs } from './data/mockVendorSupport';
import { HelpCircle, History, PlusCircle } from 'lucide-react';

const HelpSupport = () => {
  const [queries, setQueries] = useState(mockQueries);

  const handleAddQuery = (newQuery) => {
    setQueries([...queries, newQuery]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <h1 style={styles.pageTitle}>Help & Support</h1>
          <p style={styles.pageSubtitle}>Need assistance? Raise a query or check our FAQs.</p>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.leftCol}>
          <div style={styles.sectionHeader}>
            <PlusCircle size={20} color="var(--primary, #6366f1)" />
            <span style={styles.sectionTitleText}>New Inquiry</span>
          </div>
          <RaiseQueryForm onAddQuery={handleAddQuery} />
        </div>

        <div style={styles.rightCol}>
          <div style={styles.sectionHeader}>
            <History size={20} color="var(--primary, #6366f1)" />
            <span style={styles.sectionTitleText}>Ticket History</span>
          </div>
          <QueryList queries={queries} />
        </div>
      </div>

      <div style={styles.faqSectionWrapper}>
        <div style={styles.sectionHeader}>
          <HelpCircle size={20} color="var(--primary, #6366f1)" />
          <span style={styles.sectionTitleText}>Common Knowledge</span>
        </div>
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 'var(--spacing-xl, 32px)',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xl, 32px)',
    animation: 'fadeIn 0.5s ease-out'
  },
  header: {
    marginBottom: 'var(--spacing-md, 16px)'
  },
  titleWrapper: {},
  pageTitle: {
    fontSize: 'var(--font-size-2xl, 1.5rem)',
    fontWeight: 'var(--font-weight-extrabold, 800)',
    color: 'var(--text-primary, #0f172a)',
    margin: 0,
    letterSpacing: '-0.025em'
  },
  pageSubtitle: {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--text-secondary, #64748b)',
    marginTop: '6px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-xl, 32px)',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md, 16px)'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md, 16px)',
    maxHeight: '800px'
  },
  faqSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md, 16px)',
    marginBottom: 'var(--spacing-2xl, 48px)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 4px'
  },
  sectionTitleText: {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--text-light, #1e293b)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};

export default HelpSupport;
