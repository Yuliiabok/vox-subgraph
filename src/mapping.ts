import { BigInt, BigDecimal, log} from "@graphprotocol/graph-ts"
import {
  VoxMaster,
  Claim,
  ClaimAndStake,
  Deposit,
  EmergencyWithdraw,
  OwnershipTransferred,
  Recovered,
  Withdraw
} from "../generated/VoxMaster/VoxMaster"
import { VClaim, VClaimAndStake, VDeposit, WithdrawEmergency, Ownership, VRecovered, VWithdraw } from "../generated/schema"

export function Decimals64to32(amount: BigInt, decimals: BigInt): BigDecimal {
  let totaldecimals = BigInt.fromI32(10);
  for (
		let i = BigInt.fromI32(1);
		i.lt(decimals);
		i = i.plus(BigInt.fromI32(1))
	) {
		totaldecimals = totaldecimals.times(BigInt.fromI32(10));
	}
  return amount.toBigDecimal().div(totaldecimals.toBigDecimal());
}

export function handleClaim(event: Claim): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = VClaim.load(event.params.pid.toString())
  if (entity == null) {
    entity = new VClaim(event.params.pid.toString())
  }
  
  let totaldecimals = BigInt.fromI32(18)

  entity.hash = event.transaction.hash
  entity.amount = Decimals64to32(event.params.amount, totaldecimals)
  entity.save()
}

export function handleClaimAndStake(event: ClaimAndStake): void {
  let entity = VClaimAndStake.load(event.params.pid.toString())
  if (entity == null) {
    entity = new VClaimAndStake(event.params.pid.toString())
  }
  let totaldecimals = BigInt.fromI32(18)
  entity.hash = event.transaction.hash
  entity.user_address = event.params.user
  entity.amount = Decimals64to32(event.params.amount, totaldecimals)
  entity.save()
}

export function handleDeposit(event: Deposit): void {
  let entity = VDeposit.load(event.params.pid.toString())
  if (entity == null) {
    entity = new VDeposit(event.params.pid.toString())
  }
  entity.user_address = event.params.user
  entity.amount = event.params.amount
  entity.save()
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let entity = WithdrawEmergency.load(event.params.pid.toString())
  if (entity == null) {
    entity = new WithdrawEmergency(event.params.pid.toString())
  }
  entity.user_address = event.params.user
  entity.amount = event.params.amount
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let entity = Ownership.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new Ownership(event.transaction.hash.toHex())
  }
  entity.previous_owner = event.params.previousOwner
  entity.new_owner = event.params.newOwner
  entity.save()
}

export function handleRecovered(event: Recovered): void {
  let entity = VRecovered.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new VRecovered(event.transaction.hash.toHex())
  }
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.save()
}

export function handleWithdraw(event: Withdraw): void {
  let entity = VWithdraw.load(event.params.pid.toString())
  if (entity == null) {
    entity = new VWithdraw(event.params.pid.toString())
  }
  entity.user_address = event.params.user
  entity.amount = event.params.amount
  entity.save()
}
