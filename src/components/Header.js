const Header = () => {
  return (
    <header
      role="banner"
      style={{
        backgroundColor: '#170055',
        color: '#F4F4F6',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ margin: '0' }}>IMDb episode ratings</h1>
    </header>
  );
};

export default Header;
