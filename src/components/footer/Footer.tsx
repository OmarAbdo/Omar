import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src="your-image-url" alt="Your Logo" />
        <p>Your Text</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>Sub Header</h3>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>Sub Header</h3>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>Sub Header</h3>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src="social-media-icon-1" alt="Social Media Icon 1" />
          <img src="social-media-icon-2" alt="Social Media Icon 2" />
          <img src="social-media-icon-3" alt="Social Media Icon 3" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;