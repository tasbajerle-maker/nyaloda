import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function DailyChecklistPage({ tasks, taskLog, onToggleTask, onNavigate }) {

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Jó reggelt!";
        if (hour < 18) return "Szép napot!";
        return "Jó estét!";
    };

    return (
        // A partner oldali lila-kék témát használjuk a fejlécen
        <Box className="partner-theme">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Napi Küldetés
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('dashboard')}>&larr; Vissza</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box className="glass-card" sx={{ p: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {getGreeting()}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Ezek a mai teendőid. Teljesítésre fel!
                    </Typography>

                    <List>
                        {tasks.map(task => {
                            const isCompleted = taskLog.some(log => log.taskId === task.id);
                            return (
                                <ListItem
                                    key={task.id}
                                    className={`checklist-item ${isCompleted ? 'completed' : ''}`}
                                    onClick={() => onToggleTask(task.id, !isCompleted)}
                                    sx={{ 
                                        borderRadius: '8px', 
                                        mb: 1, 
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={isCompleted}
                                            tabIndex={-1}
                                            disableRipple
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<CheckCircleIcon />}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={task.text} />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Container>
        </Box>
    );
}

export default DailyChecklistPage;