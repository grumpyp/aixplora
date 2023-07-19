import {Box, TextInput, Button, Checkbox, Tooltip} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import './Urlloader.css';
import {useEffect, useState} from "react";
import {apiCall} from "../../../utils/api";

export function UrlLoader() {
    const [website, setWebsite] = useState('');
    const [sitemap, setSitemap] = useState(false);

    const handleUrlUpload = () => {
        const payload = {
            website: website, // Replace `website` with the actual value you want to send
            sitemap: sitemap, // Replace `sitemap` with the actual value you want to send
        };
        console.log(payload);
        apiCall('/files', 'POST', payload)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log('Error fetching config:', error);
            });

    };

    const [focused, setFocused] = useState(false);

    return (
        <div className="urlloader">
            <Box>
                <div>
                    <TextInput
                        style={{flex: '1', margin: '0 5px'}}
                        icon={<IconSearch size="1rem"/>}
                        placeholder="https://aixplora.app"
                        size={"sm"}
                        onChange={(event) => setWebsite(event.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        inputContainer={(children) => (
                            <Tooltip
                                label="By enabling the checkbox, the whole sitemap of the website will be scraped and everything will be indexed. Note: This will probably take a while!"
                                position="top-start"
                                opened={focused}
                            >
                                {children}
                            </Tooltip>
                        )}
                    />
                    <div style={{display: 'flex', gap: '10px', margin: '5px 5px'}}>
                        <Checkbox label={"Index whole sitemap"} style={{marginTop: '10px'}}
                                  onChange={(event) => setSitemap(event.currentTarget.checked)}
                                  disabled
                        />
                        <Button onClick={handleUrlUpload}>
                            Upload
                        </Button>
                    </div>
                </div>


            </Box>
        </div>
    );
}

export default UrlLoader;
