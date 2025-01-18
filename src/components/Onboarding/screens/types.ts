export interface ScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
  onComplete?: () => void;
  onLogin?: () => void;
  isLast?: boolean;
  isFirst?: boolean;
}