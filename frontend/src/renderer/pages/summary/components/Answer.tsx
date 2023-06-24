import {useState} from 'react';
import {Button, Collapse} from '@mantine/core';
import PulseLoader from 'react-spinners/PulseLoader';
import {IconCopy, IconClipboardCheck} from '@tabler/icons-react';
import logo from '../../../components/assets/AIxplora_logo_round.png';
import '../summary.css';
import jsPDF from 'jspdf';

type AnswerProps = {
    content: string;
    summaryList?: string;
    isLoading: boolean; np
    requestFired: boolean;
};

function Answer({content, summaryList, isLoading, requestFired}: AnswerProps) {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    let timeoutId: any;

    const copyText = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setCopied(false);
        }, 5000);
    };

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        const contentLines = doc.splitTextToSize(content, 180); // Adjust the width as per your requirements
        doc.text(contentLines, 10, 10);

        if (summaryList) {
            const summaryLines = doc.splitTextToSize(summaryList, 180); // Adjust the width as per your requirements
            doc.text(summaryLines, 10, 30);
        }

        doc.save('document.pdf');
    };

    return (
        <div className={isLoading || requestFired ? "summary_container" : ""}>      {isLoading ? (
            <PulseLoader color="#000" loading={isLoading} size={3} aria-label="Loading Spinner"/>
        ) : requestFired ? (
            <>
                <div onClick={copyText} className="copy_button">
                    {copied ? <IconClipboardCheck color="green"/> : <IconCopy/>}
                </div>
                <div className="avatar">
                    <img className="avatar_image" src={logo} alt=""/>
                </div>
                <div className="content">
                    <div dangerouslySetInnerHTML={{__html: content.replace(/\n/g, '<br />')}}/>
                </div>
                {summaryList && (
                    <>
                        <Button onClick={() => setOpen(!open)} aria-controls="summary-list-collapse"
                                aria-expanded={open}>
                            {open ? 'Hide Summary List' : 'Show Summary List'}
                        </Button>
                        <Collapse in={open}>
                            <div id="summary-list-collapse">
                                <div>
                                    <div dangerouslySetInnerHTML={{__html: summaryList.replace(/\n/g, '<br />')}}/>
                                </div>
                            </div>
                        </Collapse>
                    </>
                )}
                <Button onClick={downloadPdf}>Download PDF</Button>
            </>
        ) : null}
        </div>
    );
}

export default Answer;
