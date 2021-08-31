const Footer = () => {
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        bottom: '0',
        width: '100%',
        height: '3em',
        backgroundColor: '#3E00FF',
        color: '#f4f4f6',
      }}
    >
      <p style={{ margin: '0' }}>
        Powered by OMDb ©{new Date().getFullYear()} Hallvard Jensen
      </p>
    </footer>
  );
};

export default Footer;
