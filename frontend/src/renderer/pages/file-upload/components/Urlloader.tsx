import {Box, TextInput, Button, Checkbox, Tooltip} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import './Urlloader.css';
import {useState} from "react";

export function UrlLoader() {
    const handleUrlUpload = () => {
        console.log('Url Upload');
    };

    const [focused, setFocused] = useState(false);

    return (
        <div className="urlloader">
            <Box>
                <div>
                    <TextInput
                        style={{flex: '1', margin: '0 5px'}}
                        icon={<IconSearch size="1rem"/>}
                        placeholder="Website URL"
                        size={"sm"}
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
                        <Checkbox label={"Index whole sitemap"} style={{marginTop: '10px'}}/>
                        <Button>
                            Upload
                        </Button>
                    </div>
                </div>


            </Box>
        </div>
    );
}

export default UrlLoader;
