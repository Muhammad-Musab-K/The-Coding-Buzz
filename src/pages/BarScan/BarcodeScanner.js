import React, { useState } from 'react';
import Scanner from '../../Scanner';
import beep from "../../assets/sound.mp3";
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';

const BarcodeScanner = () => {
    const [results, setResults] = useState([]);
    const [audio] = useState(new Audio(beep));
    const [data, setData] = useState([]);
    const [result, setResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [codeValue, setCodeValue] = useState("");


    const playAudio = () => {
        audio.play();
    };

    const callApi = async (code) => {
        setIsLoading(true);

        try {
            const response = await axios(`https://barcodescanner.myftp.org/data/${code}`);

            playAudio();
            if (response.data.success) {
                setData(response.data?.data?.row[0]);
                setResult(true);
            } 

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const _onDetected = async (result) => {
        const code = result?.codeResult?.code;

        if (code) {
            setResults([result])
            setCodeValue(code);
            await callApi(code);
            console.log(result)
        } else {
            console.log("No code detected");
        }
    };

    return (
        <div className='pt-10 pb-10 w-full flex flex-col justify-center overflow-x-auto items-center'>
            <h1 className='text-3xl mb-10'>Barcode Scanner</h1>
            <p>Detected Code: {codeValue}</p>


            {results.length === 0 ? (
                <Scanner onDetected={_onDetected} />
            ) : (
                <div className='w-80 flex flex-col justify-center items-center gap-4'>
                    {isLoading ? (
                        <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#4fa94d"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    ) : (

                        <>
                            <img
                                className='w-64'
                                src={data?.image_url}
                                alt=""
                            />
                            <h1 className='ml-4 text-base mt-4'>{data?.title}</h1>
                            {data?.price ? <h1 className="ml-4 font-semibold text-xl mt-2"> Prezzo {data?.price}€</h1> : null}
                            <div className='ml-4 text-sm mt-4'>
                                <div className='flex flex-col gap-3' dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                            </div>
                            <button
                                onClick={() => {
                                    setData([]);
                                    setResults([]);
                                }}
                                className='w-24 bg-[#4fa94d] text-white p-2 rounded-lg text-sm'
                            >
                                Scan Again
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
