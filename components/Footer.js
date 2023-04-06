import styles from '@styles/Footer.module.css'

export default function Footer() {
  return (
    <div className='contentPanel'>
      <footer className={styles.footer}>
           by <a className="externalLink volstrate" rel="noreferrer" href="http://www.twitter.com/volstrate" target="_blank">volstrate</a>
      </footer>
    </div>
  );
}
