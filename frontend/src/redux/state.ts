import { UserInfo } from "./userInfo/state"
import { UserStatus } from "./auth/state"
import { EventInfo, IEventState } from "./event/state"
import { CardInfo } from "./cardSearch/state"
import { UserSocketInfo, UserAllCard, CardDetail } from "./card/state"

export interface IRootState {
  auth: UserStatus,
  userInfo: UserInfo,
  events: IEventState,
  card: UserSocketInfo,
  cardInfo: CardInfo
  userAllCard: UserAllCard
  cardDetail: CardDetail
}
