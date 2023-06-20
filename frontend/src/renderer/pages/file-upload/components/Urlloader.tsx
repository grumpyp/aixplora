import {Box, Input, Button} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import './Urlloader.css';

export function UrlLoader() {
    const handleUrlUpload = () => {
        console.log('Url Upload');
    };

    return (
        <div className="urlloader">
            <Box>
                <Input
                    icon={<IconSearch size="1rem"/>}
                    placeholder="Your email"
                />
                <Button>
                    Upload
                </Button>
            </Box>
        </div>
    );
}

export default UrlLoader;
