export interface AppSettingResponse {
  id: string;
  settingGroup: string;
  settingKey: string;
  settingValue: string;
  valueType: string;
  description: string | null;
  isPublic: boolean;
  updatedAt: Date;
}
