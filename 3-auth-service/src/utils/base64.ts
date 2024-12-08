import { Readable } from 'stream';

const base64ToStream = (base64String: string): Readable => {
    const base64Data = base64String.split(',')[1];
    const stream = new Readable();
    stream.push(base64Data);
    stream.push(null); // Indica que no hay más datos
    return stream;
  };
  

export {
    base64ToStream
};