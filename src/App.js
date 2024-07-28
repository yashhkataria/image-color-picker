import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [hexValue, setHexValue] = useState('');
  const [rgbValue, setRgbValue] = useState('');
  const [pickedColor, setPickedColor] = useState('');
  const [error, setError] = useState('');
  const [eyeDropper, setEyeDropper] = useState(null);

  useEffect(() => {
    if ('EyeDropper' in window) {
      setEyeDropper(new window.EyeDropper());
    } else {
      setError("Your browser doesn't support the EyeDropper API");
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageSrc('');
    }
  };

  const pickColor = async () => {
    if (eyeDropper) {
      try {
        const { sRGBHex } = await eyeDropper.open();
        setError('');
        
        setHexValue(sRGBHex);
        const rgbArr = [];
        for (let i = 1; i < sRGBHex.length; i += 2) {
          rgbArr.push(parseInt(sRGBHex.slice(i, i + 2), 16));
        }
        setRgbValue(`rgb(${rgbArr.join(', ')})`);
        setPickedColor(sRGBHex);
      } catch (err) {
        setError(err.toString().includes("AbortError") ? '' : err.message);
      }
    }
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value).then(() => {
      window.alert('Color Code Copied!');
    });
  };

  const clearImage = () => {
    setImageSrc('');
    setHexValue('');
    setRgbValue('');
    setPickedColor('');
  };

  return (
    <div className="wrapper">
      <h1>Image Color Picker</h1>
      <div className="image-container">
        {imageSrc ? (
          <img id="image" src={imageSrc} alt="Selected" />
        ) : (
          <div className="placeholder">No Image Uploaded</div>
        )}
      </div>
      <div className="btns-container">
        <input type="file" id="file" onChange={handleFileChange} />
        <label htmlFor="file">Open A Photo</label>
        <button id="pick-color" onClick={pickColor}>Pick Color</button>
        <button id="clear-image" onClick={clearImage}>Clear</button>
      </div>
      {error && <div id="error">{error}</div>}
      {(hexValue || rgbValue) && (
        <div id="result">
          <div>
            <input type="text" value={hexValue} readOnly />
            <button onClick={() => copyToClipboard(hexValue)}>
              <i className="fa-regular fa-copy"></i>
            </button>
          </div>
          <div>
            <input type="text" value={rgbValue} readOnly />
            <button onClick={() => copyToClipboard(rgbValue)}>
              <i className="fa-regular fa-copy"></i>
            </button>
          </div>
          <div id="picked-color-ref" style={{ backgroundColor: pickedColor }}></div>
        </div>
      )}
      <footer>
        <p>
          Made with ❤️ by{' '}
          <a href="https://yash-kataria.vercel.app" target="_blank" rel="noreferrer">
            <img src="./yk.png" alt="Yash Kataria" />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
