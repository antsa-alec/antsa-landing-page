import { Fragment } from 'react';

/**
 * AUDIENCE STRIP — a white band listing the mental health professions ANTSA
 * is used across, separated by bullet dots. Static, no props.
 */

const AUDIENCES = [
  'Psychologists',
  'Psychiatrists',
  'Mental health nurses',
  'Therapists',
  'Counsellors',
  'Mental health social workers',
  'Occupational therapists',
  'Allied health professionals',
  'Clinics & community services',
  'Schools & universities',
];

export default function AudienceStrip() {
  return (
    <section style={{ background: '#fff', padding: '28px 0', borderBottom: '1px solid #E6E9EE' }}>
      <div className="dc-container">
        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: '#AAB2BD',
            margin: '0 0 16px',
          }}
        >
          Used across mental health practice
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '18px 34px',
            flexWrap: 'wrap',
            fontSize: 15,
            color: '#5B6472',
            fontWeight: 500,
          }}
        >
          {AUDIENCES.map((audience, i) => (
            <Fragment key={audience}>
              <span>{audience}</span>
              {i < AUDIENCES.length - 1 && <span style={{ color: '#D8DEE7' }}>&bull;</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
