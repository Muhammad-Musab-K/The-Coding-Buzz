import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const Scanner = ({ onDetected }) => {
    const detectedRef = useRef(false);

    useEffect(() => {
        const initQuagga = async () => {
            try {
                await Quagga.init({
                    inputStream: {
                        type: 'LiveStream',
                        constraints: {
                            width: window.innerWidth,
                            height: window.innerHeight - (window.innerHeight * 0.2),
                            facingMode: 'environment',
                        },
                    },
                    decoder: {
                        readers: ['ean_reader', 'code_128_reader', 'upc_reader'],
                    },
                    locate: true,
                }, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    Quagga.start();
                });

                Quagga.onDetected((data) => {
                    if (!detectedRef.current) {
                        detectedRef.current = true;
                        onDetected(data);
                        Quagga.stop();
                        Quagga.offDetected();
                    }
                });
            } catch (err) {
                console.log(err);
            }
        };

        initQuagga();

        return () => {
            Quagga.stop();
            Quagga.offDetected();
        };
    }, [onDetected]);

    return <div
        id="interactive"
        className="viewport" />;
};

export default Scanner;
