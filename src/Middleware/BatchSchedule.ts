
import cron from 'node-cron'
import Notification from '../Controller/NotificationController'

const BatchSchedule =() =>{
    
    cron.schedule('0 17 * * *', async () => {
        console.log('⏰ Running daily batch notification...');
        await Notification.processBatchNotifications()
      });
}

export default BatchSchedule;