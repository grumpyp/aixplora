import {Box, Input, Button, Checkbox} from '@mantine/core';
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
                    placeholder="Website URL"
                    size={"lg"}
                />
                <Checkbox label={"Index whole sitemap"}/>
                <Button>
                    Upload
                </Button>
            </Box>
        </div>
    );
}

export default UrlLoader;
