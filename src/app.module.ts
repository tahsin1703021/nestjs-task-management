import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule, MongooseModule.forRoot('mongodb+srv://tahsin:safa25790@cluster0.mi5th.mongodb.net/nestJsTaskManagement?retryWrites=true&w=majority')],
})
export class AppModule {}
