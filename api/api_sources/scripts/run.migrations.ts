import { AppDatabaseMigrationManager } from '../sources/database/migration.helpers';

(() => {
    AppDatabaseMigrationManager.shared.refresh();
    //AppDatabaseMigrationManager.shared.migrate();
})()