import { IconType } from 'react-icons';

export type CardItemProps = {
  imageSrc?: string;
  name?: string;
  role?: string;
  cardImageSrc?: string;
  cardTitle?: string;
  cardContent?: string;
};

export interface NotificationCardItemProps extends CardItemProps {
  icon?: IconType;
  timeSent?: string;
  category?: string;
  isRead?: boolean;
}